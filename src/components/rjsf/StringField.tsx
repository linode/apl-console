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
  // eslint-disable-next-line no-param-reassign
  if (isHidden({ schema })) uiSchema['ui:widget'] = 'hidden'
  if (uiSchema['ui:widget'] !== 'hidden') {
    if (schema.enum && schema.enum.length > 1 && !listTooLong) {
      newUiSchema['ui:widget'] = RadioWidget
      set(newUiSchema, 'ui:options.inline', shortList)
      set(newUiSchema, 'ui:options.hasLabel', true)
    } else if (schema['x-secret'] !== undefined && !schema['x-decrypt']) {
      newUiSchema['ui:widget'] = 'password'
      set(newUiSchema, 'ui:options.autocomplete', 'off')
    }

    if (schema['x-formtype'] === 'SelectWidget' && schema.enum?.length > 0)
      newUiSchema['ui:widget'] = schema['x-formtype']
    if (schema['x-formtype'] !== 'SelectWidget') newUiSchema['ui:widget'] = schema['x-formtype']

    if (renderedPlaceholder) newUiSchema['ui:placeholder'] = renderedPlaceholder

    if (schema.enum && schema.enum.length === 1) {
      // hide one item enum that was set to its default value, as those are used for selectors
      if (schema.default) newUiSchema['ui:widget'] = 'hidden'
      else newSchema.default = schema.enum[0]
    }
  }
  const isPasswordField = (elementId: string) => {
    const regex = /password/i
    return regex.test(elementId)
  }

  const handleFocus = (elementId: string) => {
    const element = document.getElementById(elementId) as any
    if (isPasswordField(elementId)) element.type = 'text'
  }

  const handleBlur = (elementId: string) => {
    const element = document.getElementById(elementId) as any
    if (isPasswordField(elementId)) element.type = 'password'
  }

  return (
    <StringField
      {...props}
      formData={formData}
      schema={newSchema}
      uiSchema={newUiSchema}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </StringField>
  )
}
