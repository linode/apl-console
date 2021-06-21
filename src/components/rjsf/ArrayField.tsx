import React from 'react'
import ArrayField from '@rjsf/core/lib/components/fields/ArrayField'
import { utils } from '@rjsf/core'
import RadioGroup from './RadioGroup'

export default ({ children, uiSchema, schema, formData, ...props }: any): React.ReactElement => {
  const newSchema = { ...uiSchema }
  const listTooLong = schema.items?.enum?.length > 7
  if (utils.isMultiSelect(schema)) {
    if (!listTooLong) {
      newSchema['ui:widget'] = 'checkboxes'
      newSchema['ui:options'] = { inline: true }
    }
  } else if (!listTooLong) {
    newSchema['ui:widget'] = RadioGroup
  }
  return (
    <ArrayField {...props} formData={formData} schema={schema} uiSchema={newSchema}>
      {children}
    </ArrayField>
  )
}
