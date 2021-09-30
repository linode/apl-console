import React from 'react'
import StringField from '@rjsf/core/lib/components/fields/StringField'

export default ({ children, schema, uiSchema, formData, placeholder, ...props }: any): React.ReactElement => {
  const newSchema = { ...uiSchema }
  const renderedPlaceholder = placeholder ?? `${schema['x-default']}`
  newSchema['ui:placeholder'] = renderedPlaceholder
  return (
    <StringField {...props} formData={formData} schema={schema} uiSchema={newSchema}>
      {children}
    </StringField>
  )
}
