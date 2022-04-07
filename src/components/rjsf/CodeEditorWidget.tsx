import { FieldTemplateProps } from '@rjsf/core'
import CodeEditor from 'components/CodeEditor'
import React, { ChangeEventHandler } from 'react'

export default function ({ onChange, formData, ...props }: FieldTemplateProps) {
  const onChangeWrapper: ChangeEventHandler<HTMLTextAreaElement> = (formData) => {
    if (onChange) onChange(formData)
  }
  return <CodeEditor {...props} code={formData} lang='yaml' onChange={onChangeWrapper} />
}
