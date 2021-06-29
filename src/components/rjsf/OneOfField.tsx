import React from 'react'
import MultiSchemaField from '@rjsf/core/lib/components/fields/MultiSchemaField'
import RadioGroup from './RadioGroup'

export default (props: any): React.ReactElement => {
  const { children, schema, uiSchema } = props
  const newSchema = { ...uiSchema }
  if (schema.oneOf.length < 7) newSchema['ui:widget'] = RadioGroup

  return (
    <MultiSchemaField {...props} uiSchema={newSchema}>
      {children}
    </MultiSchemaField>
  )
}
