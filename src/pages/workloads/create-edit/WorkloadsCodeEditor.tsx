/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { Box } from '@mui/material'
import Ajv from 'ajv'
import { makeStyles } from 'tss-react/mui'
import YAML from 'yaml'
import useSettings from 'hooks/useSettings'

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  return {
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
  }
})

interface Props {
  code?: string
  onChange?: (yaml: string) => void
  disabled?: boolean
  setValid?: (valid: boolean) => void
  validationSchema?: any
}

export default function CodeEditor({
  code = '',
  onChange,
  setValid,
  disabled,
  validationSchema,
  ...props
}: Props): React.ReactElement {
  const [valid, setLocalValid] = useState(true)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<any[]>([])
  const { themeMode } = useSettings()
  const isLight = themeMode === 'light'
  const { classes } = useStyles()
  const ajv = new Ajv({ allErrors: true, strict: false, strictTypes: false, verbose: true })

  const fromYaml = (yaml: string): any | undefined => {
    try {
      const obj = YAML.parse(yaml)
      if (typeof obj !== 'object') throw new Error(`invalid object parsed from yaml: ${obj}`)
      setLocalValid(true)
      setError('')
      setValid?.(true)
      return obj
    } catch (e: any) {
      console.error('YAML parse error:', e)
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
      return
    }
    const validate = ajv.compile(JSON.parse(validationSchema) || {})
    const isValid = validate(parsedYaml)
    setValidationErrors(!isValid ? validate.errors ?? [] : [])
    setValid?.(isValid)
  }

  const onChangeHandler = (newValue: string | undefined) => {
    if (!newValue) return
    onChange?.(newValue) // keep YAML in parent
    fromYaml(newValue)
    validateCode(newValue)
  }

  return (
    <>
      <Editor
        className={`${classes.root}${!valid || validationErrors.length > 0 ? ` ${classes.invalid}` : ''}`}
        height='600px'
        theme={isLight ? 'light' : 'vs-dark'}
        defaultValue={code}
        language='yaml'
        onChange={onChangeHandler}
        options={{ readOnly: disabled, automaticLayout: true }}
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
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index} className={classes.errorMessageWrapper} display='flex'>
            <p>{errorMessage}</p>
          </Box>
        )
      })}
    </>
  )
}
