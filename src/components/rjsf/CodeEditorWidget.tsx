import { FieldTemplateProps } from '@rjsf/core'
import React, { ChangeEventHandler } from 'react'

import CodeEditor from '../CodeEditor'

export default ({ onChange, formData, ...props }: FieldTemplateProps) => {
  const onChangeWrapper: ChangeEventHandler<HTMLTextAreaElement> = (formData) => {
    // const cleanFormData = formData
    if (onChange) onChange(formData)
  }
  return <CodeEditor code={formData} lang='yaml' onChange={onChangeWrapper} />
}
