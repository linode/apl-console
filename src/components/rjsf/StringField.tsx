import React from 'react'
import StringField from '@rjsf/core/lib/components/fields/StringField'
import { set } from 'lodash'
import RadioWidget from './RadioWidget'

export default ({ children, schema, uiSchema, formData, placeholder, ...props }: any): React.ReactElement => {
  const newUiSchema = { ...uiSchema }
  const renderedPlaceholder = placeholder ?? `${schema['x-default'] || ''}`
  const listTooLong = schema.enum?.length > 7
  const shortList = schema.enum?.length < 5
  if (schema.enum && schema.enum.length > 1 && !listTooLong) {
    newUiSchema['ui:widget'] = RadioWidget
    set(newUiSchema, 'ui:options.inline', shortList)
    set(newUiSchema, 'ui:options.hasLabel', true)
    if (!props.required && !props.default && schema.enum[0] !== '') schema.enum.unshift('')
  }
  if (renderedPlaceholder) newUiSchema['ui:placeholder'] = renderedPlaceholder
  return (
    <StringField {...props} formData={formData} schema={schema} uiSchema={newUiSchema}>
      {children}
    </StringField>
  )
}
