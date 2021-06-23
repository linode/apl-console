import React from 'react'
import MultiSchemaField from '@rjsf/core/lib/components/fields/MultiSchemaField'
import RadioGroup from './RadioGroup'

export default (props: any): React.ReactElement => {
  const { children, schema, uiSchema, formData } = props
  const newSchema = { ...uiSchema }
  if (schema.oneOf.length < 7) newSchema['ui:widget'] = RadioGroup
  if (formData) {
    const keys = Object.keys(formData)
    if (keys.length === 1) {
      // we have a suspect nested prop with only one property? hmmmmm....
      // lets see if that one prop isOf or has is an object, bccause then
      // we probably hit upon our schema hack (one prope with subtree) and wish to hide the selector.
      // const propSchema = schema.oneOf[0]
      // // eslint-disable-next-line no-debugger
      // if (isSomeOf(propSchema) || (propSchema && propSchema !== true && propSchema.properties)) {
      //   // and that one property is a oneOf? Then hide the field
      // newSchema['ui:widget'] = 'hidden'
      // newSchema['ui:title'] = ''
      // newSchema['ui:description'] = ''
      // newSchema[keys[0]] = { 'ui:widget': 'hidden' }
      // newSchema[keys[0]] = { 'ui:title': '' }
      // newSchema[keys[0]] = { 'ui:description': '' }
      // }
    }
  }

  return (
    <MultiSchemaField {...props} uiSchema={newSchema}>
      {children}
    </MultiSchemaField>
  )
}
