import { Box, Button } from '@mui/material'
import { getServiceSchema, getServiceUiSchema } from 'common/api-spec'
import { unset } from 'lodash'
import isEqual from 'lodash/isEqual'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetSecretsApiResponse, GetServiceApiResponse } from 'store/otomi'
import DeleteButton from './DeleteButton'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  service?: GetServiceApiResponse
  secrets: GetSecretsApiResponse
  teamId: string
}

export default function ({ onSubmit, onDelete, service, secrets, teamId }: Props): React.ReactElement {
  const { appsEnabled, oboTeamId, settings, user } = useSession()
  const [schema, setSchema] = useState()
  const [uiSchema, setUiSchema] = useState()
  const [data, setData]: any = useState(service)
  const [isDirty, setDirty] = useState(false)
  const handleChange = ({ formData: inData }) => {
    const formData = { ...inData }
    const teamSubdomain = formData && formData.name ? `${formData.name}.team-${teamId}` : ''
    const defaultSubdomain = teamSubdomain
    if (formData.ingress) {
      let ing = formData.ingress
      if (!['cluster'].includes(ing.type) && (!data.ingress?.domain || ing.useDefaultSubdomain)) {
        // Set default domain and subdomain if ingress type not is 'cluster'
        ing = { ...ing }
        ing.subdomain = defaultSubdomain
        formData.ingress = ing
      }
      if (ing?.type === 'tlsPass') {
        // we don't expect some props when choosing tlsPass
        ing = { ...ing }
        unset(ing, 'hasCert')
        unset(ing, 'certArn')
        unset(ing, 'certName')
        unset(ing, 'forwardPath')
        formData.ingress = ing
      } else if (ing?.type === 'cluster') {
        // cluster has an empty ingress
        formData.ingress = { type: 'cluster' }
      }
    }
    const newSchema = getServiceSchema(appsEnabled, settings, formData, secrets)
    setSchema(newSchema)
    setUiSchema(getServiceUiSchema(appsEnabled, settings, formData, user, oboTeamId))
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
          {user.isAdmin && teamId ? ` (team ${teamId})` : ''}
        </h1>
      }
      key='createService'
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      onChange={handleChange}
      formData={data}
    >
      <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
        <Button type='submit' disabled={!isDirty} data-cy='button-submit-service'>
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
