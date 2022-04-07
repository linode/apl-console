import CodeEditor, { TextareaCodeEditorProps } from '@uiw/react-textarea-code-editor'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import YAML from 'yaml'

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  return {
    root: {
      color: p.mode === 'dark' ? p.text.primary : p.common.white,
      backgroundColor: p.background.default,
      fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      fontSize: 12,
      border: 1,
    },
    disabled: {
      backgroundColor: p.action.disabled,
    },
    invalid: {
      border: '1px solid red',
    },
  }
})

interface Props extends TextareaCodeEditorProps {
  lang?: string
  code?: string
  setValid?: CallableFunction
}

const toYaml = (obj) => YAML.stringify(obj)

export default function ({
  code: inCode,
  lang = 'yaml',
  onChange,
  setValid,
  disabled,
  ...props
}: Props): React.ReactElement {
  const startCode = isEmpty(inCode) ? '' : toYaml(inCode).replace('|\n', '').replace(/\n$/, '')
  const [code, setCode] = useState(startCode)
  const [valid, setLocalValid] = useState(true)
  const { classes } = useStyles()
  const fromYaml = (yaml) => {
    try {
      const obj = YAML.parse(yaml)
      if (typeof obj !== 'object') throw new Error(`invalid object parsed from yaml: ${obj}`)
      setLocalValid(true)
      setValid(true)
      return obj
    } catch (e) {
      setLocalValid(false)
      setValid(false)
      console.error('invalid yaml detected')
      return undefined
    }
  }

  const onChangeHandler = (e) => {
    const code = e.target.value
    setCode(code)
    const obj = fromYaml(code)
    if (onChange && valid) onChange(obj)
  }

  return (
    <CodeEditor
      className={`${classes.root}${disabled ? ` ${classes.disabled}` : ''}${!valid ? ` ${classes.invalid}` : ''}`}
      value={code}
      language={lang}
      placeholder={`Please enter ${lang.toUpperCase()} code.`}
      onChange={onChangeHandler}
      padding={15}
      disabled={disabled}
      {...props}
    />
  )
}
