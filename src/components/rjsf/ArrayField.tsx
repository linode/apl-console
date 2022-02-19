import React from 'react'
import ArrayField from '@rjsf/core/lib/components/fields/ArrayField'
import { utils } from '@rjsf/core'
import { set } from 'lodash'
import RadioWidget from './RadioWidget'

export default ({ uiSchema, schema, formData, ...props }: any): React.ReactElement => {
  const newSchema = { ...schema }
  const newUiSchema = { ...uiSchema }
  const listTooLong = schema.items?.enum?.length > 7
  const shortList = schema.items?.enum?.length < 5
  set(newUiSchema, 'ui:options.row', shortList)

  if (!listTooLong) {
    if (utils.isMultiSelect(schema)) {
      newUiSchema['ui:widget'] = 'checkboxes'
      set(newUiSchema, 'ui:options.inline', shortList)
      set(newUiSchema, 'ui:options.label', undefined)
    } else if (schema.enum) {
      newUiSchema['ui:widget'] = RadioWidget
      set(newUiSchema, 'ui:options.inline', shortList)
    }
  }
  set(newUiSchema, 'ui:options.orderable', false)
  return <ArrayField {...props} formData={formData} schema={newSchema} uiSchema={newUiSchema} />
}
