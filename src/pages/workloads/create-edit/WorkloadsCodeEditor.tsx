/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useMemo, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import Ajv, { ErrorObject } from 'ajv'
import { makeStyles } from 'tss-react/mui'
import YAML, { Document, Pair, Scalar, Node as YamlNode, isMap } from 'yaml'
import useSettings from 'hooks/useSettings'

const useStyles = makeStyles()((theme) => ({
  root: { border: '1px solid transparent' },
  invalid: { border: '1px solid red' },
  errorMessageWrapper: {
    marginTop: theme.spacing(2),
    backgroundColor: '#feefef',
    border: '1px solid red',
    color: 'red',
    padding: '0px 5px',
  },
  errorMessage: {
    whiteSpace: 'pre-wrap',
    marginLeft: theme.spacing(3),
  },
}))

interface Props {
  code?: string
  onChange?: (yaml: string) => void
  disabled?: boolean
  setValid?: (valid: boolean) => void
  validationSchema?: any
}

// constant required for Monaco editor to group errors
const OWNER = 'yaml-ajv-validation'

export default function CodeEditor({
  code = '',
  onChange,
  setValid,
  disabled,
  validationSchema,
  ...props
}: Props): React.ReactElement {
  const [valid, setLocalValid] = useState(true)
  const [yamlErrorMsg, setYamlErrorMsg] = useState<string>('')
  const [editorInstance, setEditorInstance] = useState<any>(null)
  const [monacoInstance, setMonacoInstance] = useState<any>(null)
  const { themeMode } = useSettings()
  const isLight = themeMode === 'light'
  const { classes } = useStyles()

  // Initiate AJV (Another JSON Validator)
  const ajv = useMemo(() => new Ajv({ allErrors: true, strict: false, strictTypes: false, verbose: true }), [])
  const validator = useMemo(() => {
    let schemaObj: any = {}
    try {
      schemaObj = typeof validationSchema === 'string' ? JSON.parse(validationSchema) : validationSchema || {}
    } catch (e) {
      schemaObj = {}
    }
    try {
      return ajv.compile(schemaObj)
    } catch (e) {
      return ((_: unknown) => true) as unknown as ReturnType<typeof ajv.compile>
    }
  }, [ajv, validationSchema])

  // Set Monaco refs
  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor)
    setMonacoInstance(monaco)
  }

  // JSON Pointer unescape for AJV instancePath segments
  // e.g. '/foo~1bar' → '/foo/bar'
  const unescapeJsonPtr = (s: string) => s.replace(/~1/g, '/').replace(/~0/g, '~')

  // Convert AJV instancePath to YAML path segments (numbers for arrays)
  const pathFromInstancePath = (p: string): Array<string | number> => {
    if (!p || p === '') return []
    return p
      .replace(/^\//, '')
      .split('/')
      .filter(Boolean)
      .map(unescapeJsonPtr)
      .map((seg) => (/^\d+$/.test(seg) ? Number(seg) : seg))
  }

  // Walk YAML Document to node for a given path
  const getNodeAtPath = (doc: Document.Parsed, segments: Array<string | number>): YamlNode | null => {
    // YAML doc API can do this directly:
    // keepScalar=true → returns Scalar node instead of unwrapped value
    const node = doc.getIn(segments as any, true) as YamlNode | null
    return node ?? null
  }

  // For additionalProperties, we want the Pair.key node of the extra prop
  const getAdditionalPropertyKeyNode = (parentNode: YamlNode | null, propName: string): YamlNode | null => {
    if (!parentNode || !isMap(parentNode)) return null
    const map = parentNode
    const pair = map.items.find(
      (p: Pair) => String((p.key as Scalar | YamlNode)?.toJSON?.() ?? (p.key as any)?.value ?? '') === propName,
    )
    return pair?.key ?? null
  }

  // Prefer key/value node ranges if available; otherwise fallback to node.range
  const nodeRange = (node: YamlNode | null, prefer: 'key' | 'value' | 'node' = 'node'): [number, number] | null => {
    if (!node) return null
    // For Pair we can choose key or value
    if ((node as any).key || (node as any).value) {
      const pair = node as unknown as Pair
      const target = prefer === 'key' ? pair.key : prefer === 'value' ? pair.value : pair.value ?? pair.key
      if (target && target.range) return [target.range[0], target.range[2]]
      if (pair.key?.range) return [pair.key.range[0], pair.key.range[2]]
      if (pair.value?.range) return [pair.value.range[0], pair.value.range[2]]
    }
    if ((node as any).range) {
      const r = (node as any).range as [number, number, number]
      return [r[0], r[2]]
    }
    return null
  }

  const buildMarker = (model: monaco.editor.ITextModel, message: string, startOffset: number, endOffset: number) => {
    const start = model.getPositionAt(Math.max(0, startOffset))
    const end = model.getPositionAt(Math.max(startOffset + 1, endOffset))
    return {
      severity: monacoInstance.MarkerSeverity.Error,
      message,
      startLineNumber: start.lineNumber,
      startColumn: start.column,
      endLineNumber: end.lineNumber,
      endColumn: end.column,
    }
  }

  const validateAndMark = (text: string) => {
    if (!monacoInstance || !editorInstance) return
    const model = editorInstance.getModel()
    if (!model) return

    // Always start clean
    monacoInstance.editor.setModelMarkers(model, OWNER, [])
    setYamlErrorMsg('')

    // 1) Parse YAML into Document AST
    const doc = YAML.parseDocument(text, { keepCstNodes: true, keepNodeTypes: true })
    if (doc.errors.length > 0) {
      // Mark syntax errors precisely
      const markers = doc.errors.map((err) => {
        // err.pos can be a number or [start, end]; use first position
        const pos = Array.isArray(err.pos) ? err.pos[0] : err.pos
        const start = typeof pos === 'number' ? pos : 0
        const end = start + 1
        return buildMarker(model, err.message, start, end)
      })
      monacoInstance.editor.setModelMarkers(model, OWNER, markers)
      setLocalValid(false)
      setValid?.(false)
      setYamlErrorMsg(doc.errors.map((e) => e.message).join('\n'))
      return
    }

    // 2) Convert Document to JS for AJV (avoid YAML.parse twice)
    const data = doc.toJS({ mapAsMap: false })

    // 3) AJV validation
    let isValid = true
    let errors: ErrorObject[] = []
    try {
      isValid = validator(data) as unknown as boolean
      errors = (validator as any).errors || []
    } catch {
      // If the compiled validator throws, treat as valid to avoid blocking typing
      isValid = true
      errors = []
    }

    setLocalValid(isValid)
    setValid?.(isValid)

    if (isValid || errors.length === 0) {
      monacoInstance.editor.setModelMarkers(model, OWNER, [])
      return
    }

    // 4) Map AJV errors -> YAML nodes -> precise markers
    const markers = errors
      .map((err) => {
        const segs = pathFromInstancePath(err.instancePath)

        if (err.keyword === 'enum' && Array.isArray((err.params as any)?.allowedValues)) {
          const allowed = (err.params as any).allowedValues.join(', ')
          const node = getNodeAtPath(doc, segs)
          const r = nodeRange(node, 'node')
          const msg = `${segs.join('.') || '(root)'} must be one of: ${allowed}`
          if (r) return buildMarker(model, msg, r[0], r[1])
        }

        // Special handling by keyword
        if (err.keyword === 'additionalProperties') {
          const parentNode = getNodeAtPath(doc, segs)
          const ap = (err.params as any)?.additionalProperty
          const keyNode = getAdditionalPropertyKeyNode(parentNode, ap)
          const r = nodeRange(keyNode ?? parentNode, keyNode ? 'key' : 'node')
          const msg = `Property "${ap}" is not allowed${segs.length ? ` at /${segs.join('/')}` : ''}`
          if (r) return buildMarker(model, msg, r[0], r[1])
        }

        if (err.keyword === 'required') {
          // Missing property: highlight the parent object
          const parentNode = getNodeAtPath(doc, segs)
          const missing = (err.params as any)?.missingProperty
          const r = nodeRange(parentNode, 'node')
          const msg = `Missing required property "${missing}"${segs.length ? ` at /${segs.join('/')}` : ''}`
          if (r) return buildMarker(model, msg, r[0], r[1])
        }

        // Default: highlight the node at the exact path (value if possible)
        let node = getNodeAtPath(doc, segs)
        // If path points to a Pair's value, doc.getIn already returns that node.
        // If nothing found (e.g., patternProperties), fall back to parent
        if (!node && segs.length > 0) node = getNodeAtPath(doc, segs.slice(0, -1))

        const msg =
          err.keyword === 'type'
            ? `${segs.join('.') || '(root)'} ${err.message}`
            : `${segs.join('.') || '(root)'} ${err.message}`

        const r = nodeRange(node, 'node')
        if (r) return buildMarker(model, msg, r[0], r[1])

        return null
      })
      .filter(Boolean) as monaco.editor.IMarkerData[]

    monacoInstance.editor.setModelMarkers(model, OWNER, markers)
  }

  const onChangeHandler = (newValue: string | undefined) => {
    if (!newValue) return
    onChange?.(newValue)
    validateAndMark(newValue)
  }

  // Validate once on mount with initial code
  useEffect(() => {
    if (editorInstance && typeof code === 'string') validateAndMark(code)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorInstance, validator])

  return (
    <Editor
      className={`${classes.root}${!valid ? ` ${classes.invalid}` : ''}`}
      height='600px'
      theme={isLight ? 'light' : 'vs-dark'}
      defaultValue={code}
      language='yaml'
      onMount={handleEditorDidMount}
      onChange={onChangeHandler}
      options={{ readOnly: disabled, automaticLayout: true }}
      {...props}
    />
  )
}
