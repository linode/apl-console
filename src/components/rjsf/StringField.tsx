import StringField from '@rjsf/core/lib/components/fields/StringField'
import { set } from 'lodash'
import React from 'react'
import { isHidden } from './ObjectFieldTemplate'
import RadioWidget from './RadioWidget'

export default function ({ children, schema, uiSchema, formData, placeholder, ...props }: any): React.ReactElement {
  const newSchema = { ...schema }
  const newUiSchema = { ...uiSchema }
  const renderedPlaceholder = placeholder ?? `${schema['x-default'] || ''}`
  const listTooLong = schema.enum?.length > 7
  const shortList = schema.enum?.length < 5
  if (isHidden({ schema })) uiSchema['ui:widget'] = 'hidden'
  if (uiSchema['ui:widget'] !== 'hidden') {
    if (schema.enum && schema.enum.length === 1) {
      // hide one item enum that was set to its default value, as those are used for selectors
      if (schema.default) newUiSchema['ui:widget'] = 'hidden'
      // we can just set the default value to the one enum
      else newSchema.default = schema.enum[0]
    } else if (schema.enum && schema.enum.length > 1 && !listTooLong) {
      newUiSchema['ui:widget'] = RadioWidget
      set(newUiSchema, 'ui:options.inline', shortList)
      set(newUiSchema, 'ui:options.hasLabel', true)
    } else if (schema['x-secret'] !== undefined && !schema['x-decrypt']) {
      newUiSchema['ui:widget'] = 'password'
      set(newUiSchema, 'ui:options.autocomplete', 'off')
    } else if (schema['x-formtype']) newUiSchema['ui:widget'] = schema['x-formtype']

    if (renderedPlaceholder) newUiSchema['ui:placeholder'] = renderedPlaceholder
  }
  return (
    <StringField {...props} formData={formData} schema={newSchema} uiSchema={newUiSchema}>
      {children}
    </StringField>
  )
}
