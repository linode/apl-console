import React, { useEffect, useMemo, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import Ajv, { ErrorObject } from 'ajv'
import { makeStyles } from 'tss-react/mui'
import YAML, { Document, Pair, Node as YamlNode, isMap } from 'yaml'
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

/**
 * CodeEditor – YAML-aware validation editor with AJV-based schema enforcement and Monaco integration.
 *
 * ### Overview
 * This editor provides live YAML validation with inline error markers using Monaco Editor.
 * It combines three systems:
 *  - **YAML parser (`yaml`)** → Parses and produces a concrete syntax tree (CST) with node ranges.
 *  - **AJV (`ajv`)** → Validates the parsed YAML against a JSON Schema.
 *  - **Monaco (`@monaco-editor/react`)** → Displays code, errors, and highlights inline.
 *
 * The validation pipeline works in four phases:
 *
 * ---
 * ### 1. YAML Parsing
 * The editor uses `YAML.parseDocument(text)` to produce a `Document` object.
 * This keeps positional metadata for every node (`range: [start, middle, end]`),
 * which we later use to map AJV errors to character offsets.
 *
 * - If `doc.errors` is non-empty, the YAML itself is invalid (e.g., bad indentation, unclosed quote).
 *   These are marked immediately as syntax errors by converting `error.pos` values into
 *   Monaco markers (`setModelMarkers`).
 *
 * ---
 * ### 2. JSON Schema Validation (AJV)
 * If YAML syntax is valid, the editor converts the document to plain JS (`doc.toJS()`)
 * and runs it through an AJV validator compiled from `validationSchema`.
 * AJV emits a list of `ErrorObject`s, each describing a schema rule violation:
 *   - `instancePath`: JSON Pointer path to the failing value
 *   - `keyword`: the failing rule ("required", "type", "enum", etc.)
 *   - `params`: rule-specific details (e.g., `missingProperty`)
 *
 * ---
 * ### 3. Error-to-YAML Mapping
 * AJV reports errors as JSON paths (like `/image/repository`), which must be mapped back
 * to YAML syntax nodes. The editor reconstructs this path and locates the corresponding
 * YAML AST node via:
 *
 *    getNodeAtPath(doc, pathSegments)
 *
 * Once the relevant node is found, its `range` is extracted via:
 *
 *    nodeRange(node, prefer)
 *
 * The `prefer` argument controls whether the marker highlights the key, value, or both.
 * For example:
 *   - `"required"` → highlight the parent object
 *   - `"enum"` → highlight the exact scalar value
 *   - `"additionalProperties"` → highlight the extra property key
 *
 * Each rule type (AJV keyword) has a custom handler that determines
 * which YAML node to highlight and what message to show.
 *
 * ---
 * ### 4. Marker Creation (Monaco)
 * Once a range `[start, end]` in the YAML source is identified, the function `buildMarker`
 * converts those offsets into Monaco’s coordinate system:
 *
 *    const start = model.getPositionAt(startOffset)
 *    const end = model.getPositionAt(endOffset)
 *
 * Then it builds a `monaco.editor.IMarkerData` object with:
 *   - `severity: monaco.MarkerSeverity.Error`
 *   - `message: string` (from AJV error)
 *   - `startLineNumber`, `startColumn`, `endLineNumber`, `endColumn`
 *
 * All markers are then grouped and applied via:
 *
 *    monacoInstance.editor.setModelMarkers(model, OWNER, markers)
 *
 * The `OWNER` constant (`'yaml-ajv-validation'`) scopes markers for this validator
 * so they can be cleared or replaced easily between validation runs.
 */

export default function CodeEditor({
  code = '',
  onChange,
  setValid,
  disabled,
  validationSchema,
  ...props
}: Props): React.ReactElement {
  const [valid, setLocalValid] = useState(true)
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
    const map = parentNode as unknown as { items: Pair<YamlNode, YamlNode>[] }
    const pair = map.items.find((p) => {
      const key = p.key
      const keyValue = String((key as any)?.toJSON?.() ?? (key as any)?.value ?? '')
      return keyValue === propName
    })
    return pair?.key ?? null
  }

  // Prefer key/value node ranges if available; otherwise fallback to node.range
  // 'node' = 'node' is not a mistake, it's setting the default for 'prefer' parameter
  const nodeRange = (node: YamlNode | null, prefer: 'key' | 'value' | 'node' = 'node'): [number, number] | null => {
    if (!node) return null

    // Handle YAML key-value pair nodes
    const isPair = (node as any).key || (node as any).value
    if (isPair) {
      const pair = node as unknown as Pair
      let target: YamlNode | undefined

      // Choose which part of the Pair to highlight
      switch (prefer) {
        case 'key':
          target = pair.key as YamlNode
          break
        case 'value':
          target = pair.value as YamlNode
          break
        default: // 'node' (prefer value, fallback to key)
          target = (pair.value as YamlNode) ?? (pair.key as YamlNode)
          break
      }

      // Try the chosen node first, then fallback to key/value if needed
      if (target?.range) return [target.range[0], target.range[2]]
      if ((pair.key as YamlNode)?.range) return [(pair.key as YamlNode).range[0], (pair.key as YamlNode).range[2]]
      if ((pair.value as YamlNode)?.range) return [(pair.value as YamlNode).range[0], (pair.value as YamlNode).range[2]]
    }

    // Handle plain YAML nodes (Scalar, Sequence, etc.)
    const range = (node as any).range as [number, number, number] | undefined
    if (range) return [range[0], range[2]]

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

    // 1) Parse YAML into Document AST
    const doc = YAML.parseDocument(text)
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

        /*
         *You can add custom logic here for each keyword if desired
         */

        // Handle Enum keywords, add allowed enum types to error
        if (err.keyword === 'enum' && Array.isArray((err.params as any)?.allowedValues)) {
          const allowed = (err.params as any).allowedValues.join(', ')
          const node = getNodeAtPath(doc, segs)
          const r = nodeRange(node, 'node')
          const msg = `${segs.join('.') || '(root)'} must be one of: ${allowed}`
          if (r) return buildMarker(model, msg, r[0], r[1])
        }

        // Handle additional Properties keywords, prevent non existing properties from being added
        if (err.keyword === 'additionalProperties') {
          const parentNode = getNodeAtPath(doc, segs)
          const ap = (err.params as any)?.additionalProperty
          const keyNode = getAdditionalPropertyKeyNode(parentNode, ap)
          const r = nodeRange(keyNode ?? parentNode, keyNode ? 'key' : 'node')
          const msg = `Property "${ap}" is not allowed${segs.length ? ` at /${segs.join('/')}` : ''}`
          if (r) return buildMarker(model, msg, r[0], r[1])
        }

        // Handle required keywords, highlight parent object with missing property
        if (err.keyword === 'required') {
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

        const msg = `${segs.join('.') || '(root)'} ${err.message}`

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
