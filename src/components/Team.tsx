import React from 'react'
import Form from 'react-jsonschema-form-bs4'
import { getSchema } from '../hooks/api'
import CustomDescriptionField from './CustomDescriptionField'

const fields = {
  DescriptionField: CustomDescriptionField,
}

export default ({ onSubmit, clusters, team = {} }): any => {
  const handleSubmit = (form): any => {
    onSubmit(form.formData)
  }
  const schema = getSchema()
  const mySchema = schema.getTeamSchema(clusters)
  const uiSchema = schema.getTeamUiSchema(mySchema)
  return (
    <div className='Team'>
      <h2>Team details:</h2>
      <Form
        key='createTeam'
        schema={mySchema}
        fields={fields}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onError={console.error}
        formData={team}
        // liveValidate={true}
      />
    </div>
  )
}
