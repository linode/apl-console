import { WidgetProps } from '@rjsf/core'
import CodeEditor from 'components/CodeEditor'
import { isEmpty } from 'lodash'
import React, { ChangeEventHandler } from 'react'

export default function ({ onChange, formData, schema }: WidgetProps) {
  const onChangeWrapper: ChangeEventHandler<HTMLTextAreaElement> = (formData) => {
    if (onChange) onChange(formData)
  }
  const code = isEmpty(formData) && schema['x-default'] ? schema['x-default'] : formData
  return <CodeEditor code={code} lang='yaml' onChange={onChangeWrapper} />
}
