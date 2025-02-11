import { FieldTemplateProps } from '@rjsf/utils'
import CodeEditor from 'components/CodeEditor'
import React from 'react'
import FieldTemplate from './FieldTemplate'

export default function ({ onChange, formData, rawErrors, schema, disabled, ...other }: FieldTemplateProps) {
  return (
    <FieldTemplate
      disabled={disabled}
      schema={schema}
      onChange={undefined}
      formData={formData}
      rawErrors={rawErrors}
      {...other}
    >
      <CodeEditor
        code={disabled && !formData && schema['x-default'] ? schema['x-default'] : formData}
        lang='yaml'
        onChange={onChange}
        disabled={disabled}
      />
    </FieldTemplate>
  )
}
