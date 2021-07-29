import React from 'react'
import ArrayField from '@rjsf/core/lib/components/fields/ArrayField'
import { utils } from '@rjsf/core'
import { set } from 'lodash'
import RadioGroup from './RadioGroup'

export default ({ children, uiSchema, schema, formData, ...props }: any): React.ReactElement => {
  const newSchema = { ...schema }
  const newUiSchema = { ...uiSchema }
  const listTooLong = schema.items?.enum?.length > 7
  if (utils.isMultiSelect(schema)) {
    if (!listTooLong) {
      newUiSchema['ui:widget'] = 'checkboxes'
      set(newUiSchema, 'ui:options.inline', true)
    }
  } else if (!listTooLong) {
    newUiSchema['ui:widget'] = RadioGroup
  }
  // newSchema.title = ''
  set(newUiSchema, 'ui:options.orderable', false)
  return (
    <ArrayField {...props} formData={formData} schema={newSchema} uiSchema={newUiSchema}>
      {children}
    </ArrayField>
  )
}
