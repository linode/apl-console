import { Box, Button } from '@material-ui/core'
import Form from '@rjsf/material-ui'
import { isEmpty, isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import { getServiceSchema, getServiceUiSchema } from '../api-spec'
import DeleteButton from './DeleteButton'
import Service from '../models/Service'
import { useSession } from '../session-context'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'

interface Props {
  onSubmit: CallableFunction
  onDelete?: any
  team: any
  service?: Service
  clusters: [any]
}

export default ({ onSubmit, onDelete, team, service = undefined, clusters }: Props): any => {
  const {
    user: { role, isAdmin },
  } = useSession()
  let teamSubdomain = service ? `${service.name}.team-${team.id}` : ''
  let defaultSubdomain
  const serviceData: any = service || {}
  if (serviceData.ingress && service.clusterId) {
    defaultSubdomain = `${teamSubdomain}.${serviceData.clusterId.split('/')[1]}`
    // eslint-disable-next-line no-param-reassign
    serviceData.ingress.useDefaultSubdomain = serviceData.ingress.subdomain === defaultSubdomain
  }

  const crudOperation = serviceData.id ? 'update' : 'create'
  const originalSchema = getServiceSchema(team, clusters, serviceData || {})
  const originalUiSchema = getServiceUiSchema(originalSchema, role, serviceData, crudOperation)
  const [schema, setSchema] = useState(originalSchema)
  const [uiSchema, setUiSchema] = useState(originalUiSchema)
  const [data, setData]: any = useState(serviceData)
  const [dirty, setDirty] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const handleChange = ({ formData: inData, errors }): any => {
    if (errors && errors.length) {
      setInvalid(true)
    } else {
      setInvalid(false)
    }
    teamSubdomain = inData && inData.name ? `${inData.name}.team-${team.id}` : ''
    const clusterSuffix = inData && inData.clusterId ? `.${inData.clusterId.split('/')[1]}` : ''
    defaultSubdomain = `${teamSubdomain}${clusterSuffix}`
    const formData = { ...inData }
    // if (!data) return
    if (!isEmpty(formData.ingress)) {
      if (formData.ingress.useDefaultSubdomain || formData.ingress.domain !== data.ingress.domain) {
        // Set default subdomain of domain change
        formData.ingress = { ...formData.ingress }
        formData.ingress.subdomain = formData.ingress.useDefaultSubdomain ? defaultSubdomain : ''
      }
      setSchema(getServiceSchema(team, clusters, formData))
      setUiSchema(getServiceUiSchema(schema, role, formData, crudOperation))
    }
    setData(formData)
    setDirty(!isEqual(formData, service))
  }
  const handleSubmit = ({ formData }): any => {
    onSubmit(formData)
  }

  return (
    <div>
      <h1 data-cy={data && data.serviceId ? `h1-edit-service-page` : 'h1-newservice-page'}>
        {data && data.id ? `Service: ${data.name}` : 'New Service'}
        {isAdmin && team ? ` (team ${team.id})` : ''}
      </h1>
      <Form
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
          <Button variant='contained' color='primary' type='submit' disabled={!dirty || invalid} data-cy='button-submit-service'>
            Submit
          </Button>
          &nbsp;
          {serviceData.id && (
            <DeleteButton onDelete={() => onDelete(serviceData.id)} resourceName={data.name} resourceType='service' />
          )}
        </Box>
      </Form>
    </div>
  )
}
