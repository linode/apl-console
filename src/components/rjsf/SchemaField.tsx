import React from 'react'
import SchemaField from '@rjsf/core/lib/components/fields/SchemaField'

export default ({ children, uiSchema, formData, ...props }: any): React.ReactElement => {
  const listTooLong = formData && formData.length > 7
  const newSchema = { ...uiSchema }
  if (!listTooLong) newSchema['ui:widget'] = 'checkboxes'
  return (
    <SchemaField {...props} formData={formData} uiSchema={newSchema}>
      {children}
    </SchemaField>
  )
}
