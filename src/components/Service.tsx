import { Box, Button } from '@material-ui/core'
import isEqual from 'lodash/isEqual'
import React, { useState } from 'react'
import { Service, Secret } from '@redkubes/otomi-api-client-axios'
import { cloneDeep } from 'lodash'
import Form from './rjsf/Form'
import { getServiceSchema, getServiceUiSchema } from '../api-spec'
import DeleteButton from './DeleteButton'
import { useSession } from '../session-context'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  service?: Service
  secrets: Secret[]
  teamId: string
}

export default ({ onSubmit, onDelete, service, secrets, teamId }: Props): React.ReactElement => {
  const { user, cluster, dns, oboTeamId } = useSession()
  const [schema, setSchema] = useState()
  const [uiSchema, setUiSchema] = useState()
  const [data, setData]: any = useState(service)
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData: inData }) => {
    const teamSubdomain = inData && inData.name ? `${inData.name}.team-${teamId}` : ''
    const defaultSubdomain = teamSubdomain
    // create a new object extending a clone of existing data with incoming data
    const formData = { ...cloneDeep(data), ...inData }
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
        delete ing.hasCert
        delete ing.certArn
        delete ing.certName
        delete ing.forwardPath
        formData.ingress = ing
      } else if (ing?.type === 'cluster') {
        // cluster has an empty ingress
        formData.ingress = { type: 'cluster' }
      }
    }
    const newSchema = getServiceSchema(cluster, dns, formData, secrets)
    setSchema(newSchema)
    setUiSchema(getServiceUiSchema(formData, user, oboTeamId))
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
      liveValidate={false}
      showErrorList={false}
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
