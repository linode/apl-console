import React from 'react'
import Form from 'react-jsonschema-form-bs4'
import { getSchema } from '../../hooks/api'
import CustomDescriptionField from '../CustomDescriptionField'

const fields = {
  DescriptionField: CustomDescriptionField,
}

export default ({ onSubmit, clusters, service = {} }): any => {
  const handleSubmit = (form): any => {
    onSubmit(form.formData)
  }
  const schema = getSchema()
  const mySchema = schema.getServiceSchema(clusters)
  const uiSchema = schema.getServiceUiSchema(mySchema)
  return (
    <div className='Service'>
      <Form
        key='createService'
        schema={mySchema}
        fields={fields}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onError={console.error}
        formData={service}
        // liveValidate={true}
      />
    </div>
  )
}
