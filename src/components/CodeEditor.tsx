/* eslint-disable no-nested-ternary */
import MonacoEditor, { MonacoEditorProps } from '@uiw/react-monacoeditor'
import { isEmpty } from 'lodash'
import { Box } from '@mui/material'
import React, { useState } from 'react'
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

interface Props extends MonacoEditorProps {
  lang?: string
  code?: string
  onChange?: any
  disabled?: boolean
  setValid?: CallableFunction
  showComments?: boolean
}

const toYaml = (obj) => YAML.stringify(obj, { blockQuote: 'literal' })

export default function ({
  code: inCode,
  lang = 'yaml',
  onChange,
  setValid,
  disabled,
  showComments = false,
  ...props
}: Props): React.ReactElement {
  const [startCode] = useState(isEmpty(inCode) ? '' : toYaml(inCode).replace('|\n', '').replace(/\n$/, ''))
  const document = parseDocument(startCode)
  sortDeep(document.contents)
  const modifiedCode = showComments ? document.toJSON() : startCode
  const [valid, setLocalValid] = useState(true)
  const [error, setError] = useState('')
  const { themeMode } = useSettings()
  const isLight = themeMode === 'light'
  const { classes } = useStyles()
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

  return (
    <>
      <MonacoEditor
        className={`${classes.root}${!valid ? ` ${classes.invalid}` : ''}`}
        height='900px'
        theme={isLight ? 'light' : 'vs-dark'}
        value={modifiedCode}
        language={lang}
        placeholder={`Please enter ${lang.toUpperCase()} code.`}
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
    </>
  )
}
