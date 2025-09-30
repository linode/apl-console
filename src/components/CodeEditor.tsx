/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { isEmpty } from 'lodash'
import { Box } from '@mui/material'
import Ajv from 'ajv'
import { makeStyles } from 'tss-react/mui'
import YAML, { ParsedNode, YAMLMap, YAMLSeq, parseDocument } from 'yaml'
import useSettings from 'hooks/useSettings'

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  return {
    root: {
      border: '1px solid transparent',
    },
    disabled: {
      backgroundColor: p.action.disabled,
    },
    invalid: {
      border: '1px solid red',
    },
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
  }
})

function sortDeep(node: ParsedNode | null): void {
  if (node instanceof YAMLMap) {
    node.items.sort((itemA, itemB) => (itemA.key < itemB.key ? -1 : itemA.key > itemB.key ? 1 : 0))
    node.items.forEach((item) => sortDeep(item.value))
  } else if (node instanceof YAMLSeq) node.items.forEach((item) => sortDeep(item))
}

interface Props {
  lang?: string
  code?: string | Record<string, unknown>
  onChange?: (obj: any) => void
  disabled?: boolean
  setValid?: (valid: boolean) => void
  showComments?: boolean
  validationSchema?: any
  setWorkloadValues?: (obj: any) => void
}

export default function CodeEditor({
  code: inCode,
  lang = 'yaml',
  onChange,
  setValid,
  disabled,
  showComments = false,
  validationSchema,
  setWorkloadValues,
  ...props
}: Props): React.ReactElement {
  const [startCode] = useState(() => {
    if (isEmpty(inCode)) return ''
    return typeof inCode === 'string' ? inCode.replace(/\n$/, '') : YAML.stringify(inCode).replace(/\n$/, '')
  })

  const document = parseDocument(startCode)
  sortDeep(document.contents)

  const modifiedCode = showComments ? document.toString() : startCode

  const [valid, setLocalValid] = useState(true)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<any[]>([])
  const { themeMode } = useSettings()
  const isLight = themeMode === 'light'
  const { classes } = useStyles()
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    strictTypes: false,
    verbose: true,
  })

  const fromYaml = (yaml: string): any | undefined => {
    try {
      const obj = YAML.parse(yaml)
      if (typeof obj !== 'object') throw new Error(`invalid object parsed from yaml: ${obj}`)

      setLocalValid(true)
      setError('')
      setValid?.(true)
      return obj
    } catch (e: any) {
      console.error('error', e)
      setError(e.message)
      setLocalValid(false)
      setValid?.(false)
      return undefined
    }
  }

  const validateCode = (newValue: string) => {
    let parsedYaml
    try {
      parsedYaml = YAML.parse(newValue)
    } catch {
      console.error('failed parsing yaml for validation')
      return
    }
    const validate = ajv.compile(validationSchema || {})
    const isValid = validate(parsedYaml)
    setValidationErrors(!isValid ? validate.errors ?? [] : [])
    setValid?.(isValid)
  }

  const onChangeHandler = (newValue: string | undefined) => {
    if (!newValue) return
    const obj = fromYaml(newValue)
    if (obj && onChange) onChange(obj)
    validateCode(newValue)
  }

  useEffect(() => {
    const obj = fromYaml(modifiedCode)
    setWorkloadValues?.(obj)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifiedCode])

  return (
    <>
      <Editor
        className={`${classes.root}${!valid || validationErrors.length > 0 ? ` ${classes.invalid}` : ''}`}
        height='600px'
        theme={isLight ? 'light' : 'vs-dark'}
        defaultValue={modifiedCode}
        language={lang}
        onChange={onChangeHandler}
        options={{
          readOnly: disabled,
          automaticLayout: true,
        }}
        {...props}
      />
      {error && (
        <Box className={classes.errorMessageWrapper} display='flex'>
          <p className={classes.errorMessage}>{error}</p>
        </Box>
      )}
      {validationErrors.map((err, index) => {
        const lastSegment = err.instancePath.split('/').pop()
        const instancePath = err.instancePath ? `at ${err.instancePath}` : ''
        const errorMessage =
          err.keyword === 'additionalProperties'
            ? `Additional property "${err.params.additionalProperty}" is not allowed ${instancePath}`
            : `"${lastSegment}" ${err.message} ${instancePath}`
        return (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={classes.errorMessageWrapper}
            display='flex'
          >
            <p>{errorMessage}</p>
          </Box>
        )
      })}
    </>
  )
}
