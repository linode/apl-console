import { Box, Button } from '@material-ui/core'
import { isEmpty, isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import { Service, Secret } from '@redkubes/otomi-api-client-axios'
import Form from './rjsf/Form'
import { getServiceSchema, getServiceUiSchema } from '../api-spec'
import DeleteButton from './DeleteButton'
import { useSession } from '../session-context'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  service?: Service
  secrets: Secret[]
  teamId: string
}

export default ({ onSubmit, onDelete, service, secrets, teamId }: Props): React.ReactElement => {
  const {
    user: { roles, isAdmin, authz },
    user,
    cluster,
    dns,
    oboTeamId,
  } = useSession()
  const [schema, setSchema] = useState()
  const [uiSchema, setUiSchema] = useState()
  const [data, setData]: any = useState(service)
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData: inData }) => {
    const teamSubdomain = inData && inData.name ? `${inData.name}.team-${teamId}` : ''
    const defaultSubdomain = teamSubdomain
    const formData = { ...inData }
    if (!isEmpty(formData.ingress)) {
      if (formData.ingress.useDefaultSubdomain || formData.ingress.domain !== data.ingress.domain) {
        // Set default subdomain of domain change
        formData.ingress = { ...formData.ingress }
        formData.ingress.subdomain = formData.ingress.useDefaultSubdomain ? defaultSubdomain : ''
      }
    }
    const newSchema = getServiceSchema(dns, formData, secrets)
    setSchema(newSchema)
    setUiSchema(
      getServiceUiSchema(formData, cluster.provider.toString(), user, oboTeamId, formData.id ? 'update' : 'create'),
    )
    setData(formData)
    setDirty(!isEqual(formData, service))
  }
  if (!(schema || uiSchema)) {
    handleChange({ formData: service || {} })
    return null
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
  }
  return (
    <Form
      title={
        <h1 data-cy={data && data.serviceId ? `h1-edit-service-page` : 'h1-newservice-page'}>
          {data && data.id ? `Service: ${data.name}` : 'New Service'}
          {isAdmin && teamId ? ` (team ${teamId})` : ''}
        </h1>
      }
      key='createService'
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      onChange={handleChange}
      formData={data}
      liveValidate={false}
      showErrorList={false}
      ObjectFieldTemplate={ObjectFieldTemplate}
    >
      <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
        <Button variant='contained' color='primary' type='submit' disabled={!dirty} data-cy='button-submit-service'>
          Submit
        </Button>
        &nbsp;
        {data && data.id && (
          <DeleteButton
            onDelete={() => onDelete(data.id)}
            resourceName={data.name}
            resourceType='service'
            dataCy='button-delete-service'
          />
        )}
      </Box>
    </Form>
  )
}
