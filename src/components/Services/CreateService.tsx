import { useSnackbar } from 'material-ui-snackbar-provider'
import React, { useState } from 'react'
import Form from 'react-jsonschema-form-bs4'
import { getSchema, useApi } from '../../hooks/api'
import { useSession } from '../../session-context'
import CustomDescriptionField from '../CustomDescriptionField'

const fields = {
  DescriptionField: CustomDescriptionField,
}

const Submit = ({ data }): any => {
  const { team } = useSession()
  const snackbar = useSnackbar()
  const [result] = useApi('addServiceToTeam', team.name, data)
  if (result) {
    snackbar.showMessage('Service created')
  }

  return null
}

const CreateService = ({ onSubmit }): any => {
  const { team } = useSession()
  const handleSubmit = (form): any => {
    onSubmit()
    setFormData(form.formData)
  }
  const [formData, setFormData] = useState()
  const schema = getSchema()
  const mySchema = schema.getServiceSchema(team.clusters)
  const uiSchema = schema.getServiceUiSchema(mySchema)
  return (
    <div className='Service'>
      <Form
        key='createService'
        schema={mySchema}
        fields={fields}
        uiSchema={uiSchema}
        onChange={console.log}
        onSubmit={handleSubmit}
        onError={console.error}
        // liveValidate={true}
      />
      {formData && <Submit data={formData} />}
    </div>
  )
}

export default CreateService
