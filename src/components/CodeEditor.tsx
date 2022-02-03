import React, { useEffect, useState, ChangeEventHandler } from 'react'
import CodeEditor, { SelectionText, TextareaCodeEditorProps } from '@uiw/react-textarea-code-editor'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
    fontSize: 12,
    border: 1,
  },
  disabled: {
    backgroundColor: theme.palette.action.disabled,
  },
  invalid: {
    border: '1px solid red',
  },
}))

interface Props extends TextareaCodeEditorProps {
  lang?: string
  code?: string
  invalid?: boolean
}

export default ({
  code: inCode = '',
  lang = 'yaml',
  onChange,
  invalid = false,
  disabled,
  ...props
}: Props): React.ReactElement => {
  const textRef = React.useRef()
  const [code, setCode] = useState(inCode)
  const onChangeHandler = (e) => {
    setCode(e.target.value)
    if (onChange) onChange(e.target.value)
  }
  const classes = useStyles()
  return (
    <CodeEditor
      className={`${classes.root}${disabled ? ` ${classes.disabled}` : ''}${invalid ? ` ${classes.invalid}` : ''}`}
      value={code}
      ref={textRef}
      language={lang}
      placeholder={`Please enter ${lang.toUpperCase()} code.`}
      onChange={onChangeHandler}
      padding={15}
      disabled={disabled}
      {...props}
    />
  )
}
