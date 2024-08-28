/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import { Editor, useMonaco } from '@monaco-editor/react'
import { isEmpty } from 'lodash'
import { Box, Button } from '@mui/material'
import Ajv from 'ajv'
import yaml from 'js-yaml'
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
      borderRadius: theme.spacing(1),
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
  code?: string
  onChange?: any
  disabled?: boolean
  setValid?: CallableFunction
  showComments?: boolean
  validationSchema?: any
}

const toYaml = (obj) => YAML.stringify(obj, { blockQuote: 'literal' })

export default function CodeEditor({
  code: inCode,
  lang = 'yaml',
  onChange,
  setValid,
  disabled,
  showComments = false,
  validationSchema,
  ...props
}: Props): React.ReactElement {
  const monaco = useMonaco()
  const [startCode] = useState(isEmpty(inCode) ? '' : toYaml(inCode).replace('|\n', '').replace(/\n$/, ''))
  const document = parseDocument(startCode)
  sortDeep(document.contents)
  const modifiedCode = showComments ? document.toJSON() : startCode
  const [valid, setLocalValid] = useState(true)
  const [error, setError] = useState('')
  const { themeMode } = useSettings()
  const isLight = themeMode === 'light'
  const { classes } = useStyles()
  const ajv = new Ajv({ allErrors: true, strict: false })

  const fromYaml = (yaml: string): any | undefined => {
    try {
      const obj = YAML.parse(yaml)
      if (typeof obj !== 'object') throw new Error(`invalid object parsed from yaml: ${obj}`)
      setLocalValid(true)
      setError('')
      if (setValid) setValid(true)
      return obj
    } catch (e) {
      setError(e.message)
      setLocalValid(false)
      if (setValid) setValid(false)
      return undefined
    }
  }

  const onChangeHandler = (newValue: any) => {
    const code = newValue as string
    const obj = fromYaml(code)
    if (onChange && obj) onChange(obj)
  }

  const validateCode = () => {
    let parsedYaml
    try {
      parsedYaml = yaml.load(inCode)
    } catch (e) {
      if (monaco) {
        monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'owner', [
          {
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: e.mark.line + 1,
            startColumn: e.mark.column + 1,
            endLineNumber: e.mark.line + 1,
            endColumn: e.mark.column + 1,
            message: e.message,
          },
        ])
      }
      return
    }

    console.log('halo validaiton schema', validationSchema)
    const validate = ajv.compile(validationSchema)
    const valid = validate(parsedYaml)

    if (!valid) {
      console.log('validate erros', validate.errors)
      const markers = validate.errors.map((error) => ({
        severity: monaco.MarkerSeverity.Error,
        startLineNumber: 1, // <- this needs to be fixed
        startColumn: 1, // <- this needs to be fixed
        endLineNumber: 1,
        endColumn: 1,
        message: error.message,
      }))

      if (monaco) monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'owner', markers)
    } else {
      // eslint-disable-next-line no-lonely-if
      if (monaco) monaco.editor.setModelMarkers(monaco.editor.getModels()[0], 'owner', [])
    }
  }

  return (
    <>
      <Editor
        className={`${classes.root}${!valid ? ` ${classes.invalid}` : ''}`}
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
      <Button sx={{ w: '100px' }} onClick={validateCode}>
        Validate
      </Button>
    </>
  )
}
