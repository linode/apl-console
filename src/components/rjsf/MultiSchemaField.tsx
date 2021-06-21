import React from 'react'
import MultiSchemaField from '@rjsf/core/lib/components/fields/MultiSchemaField'

export default ({ children, uiSchema, formData, ...props }: any): React.ReactElement => {
  const listTooLong = formData && formData.length > 7
  const newSchema = { ...uiSchema }
  if (!listTooLong) newSchema['ui:widget'] = 'checkboxes'
  return (
    <MultiSchemaField {...props} formData={formData} uiSchema={newSchema}>
      {children}
    </MultiSchemaField>
  )
}
