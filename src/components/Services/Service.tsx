import React from 'react'
import Form from 'react-jsonschema-form-bs4'
import { useApi } from '../../hooks/api'
import CustomDescriptionField from '../CustomDescriptionField'

const fields = {
  DescriptionField: CustomDescriptionField,
}

const Service: React.FC = ({ teamId, serviceId, schema }: any): any => {
  const [service, serviceLoading, serviceError] = useApi('getService', serviceId)
  const [team, teamLoading, teamError]: [any, boolean, Error] = useApi('getTeam', teamId)

  if (serviceError || teamError) {
    return
  }
  if (serviceLoading || teamLoading) {
    return <p>{'Loading'}</p>
  }
  const mySchema = schema.getServiceSchema(team.clusters)
  const uiSchema = schema.getServiceUiSchema(mySchema)
  return (
    <div className='Service'>
      <h2>Service: {serviceId}</h2>

      <Form schema={mySchema} uiSchema={uiSchema} disabled fields={fields} formData={service}>
        <div></div>
      </Form>
    </div>
  )
}

export default Service
