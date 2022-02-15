import { FieldTemplateProps } from '@rjsf/core'
import React, { ChangeEventHandler } from 'react'

import CodeEditor from 'components/CodeEditor'

export default ({ onChange, formData, ...props }: FieldTemplateProps) => {
  const onChangeWrapper: ChangeEventHandler<HTMLTextAreaElement> = (formData) => {
    if (onChange) onChange(formData)
  }
  return <CodeEditor {...props} code={formData} lang='yaml' onChange={onChangeWrapper} />
}
