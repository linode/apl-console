import StringField from '@rjsf/core/lib/components/fields/StringField'
import { set } from 'lodash'
import React from 'react'
import RadioWidget from './RadioWidget'

export default function ({ children, schema, uiSchema, formData, placeholder, ...props }: any): React.ReactElement {
  const newUiSchema = { ...uiSchema }
  const renderedPlaceholder = placeholder ?? `${schema['x-default'] || ''}`
  const listTooLong = schema.enum?.length > 7
  const shortList = schema.enum?.length < 5
  if (schema.enum && schema.enum.length === 1) newUiSchema['ui:widget'] = 'hidden'
  else if (schema.enum && schema.enum.length > 1 && !listTooLong) {
    newUiSchema['ui:widget'] = RadioWidget
    set(newUiSchema, 'ui:options.inline', shortList)
    set(newUiSchema, 'ui:options.hasLabel', true)
  } else if (schema['x-secret'] !== undefined) newUiSchema['ui:widget'] = 'password'

  if (renderedPlaceholder) newUiSchema['ui:placeholder'] = renderedPlaceholder
  return (
    <StringField {...props} formData={formData} schema={schema} uiSchema={newUiSchema}>
      {children}
    </StringField>
  )
}
