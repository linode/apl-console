import React from 'react'
import Form from 'react-jsonschema-form-bs4'
import { useApi } from '../../hooks/api'
import CustomDescriptionField from '../CustomDescriptionField'

const fields = {
  DescriptionField: CustomDescriptionField,
}

const CreateService: React.FC = ({ teamId, schema }: any): any => {
  const onSubmit = (form): any => {
    const data = form.formData
    const [result, adding, error] = useApi('addServiceToTeam', teamId, data)
    if (result) {
      console.log('saved')
    } else if (error) {
      console.error(error)
    }
  }
  const [team, teamLoading, teamError]: [any, boolean, Error] = useApi('getTeam', teamId)
  if (teamLoading) {
    return
  } else if (teamError) {
    console.error(teamError)
  }
  const mySchema = schema.getServiceSchema(team.clusters)
  const uiSchema = schema.getServiceUiSchema(mySchema)
  return (
    <div className='Service'>
      <Form
        key='createService'
        schema={schema}
        fields={fields}
        uiSchema={uiSchema}
        onChange={console.log}
        onSubmit={onSubmit}
        onError={console.error}
        // liveValidate={true}
      />
    </div>
  )
}

export default CreateService
