import React from 'react'
import { JSONSchema7 } from 'json-schema'
import Form from './rjsf/Form'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'

interface Props {
  propertyName: string
  schema: JSONSchema7
}

export default ({ propertyName, schema }: Props): React.ReactElement => {
  return (
    <Form
      title={propertyName}
      key={propertyName}
      schema={schema}
      liveValidate={false}
      showErrorList={false}
      ObjectFieldTemplate={ObjectFieldTemplate}
    />
  )
}
