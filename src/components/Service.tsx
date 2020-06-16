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

export default ({ onSubmit, onDelete = null, team, service = null, clusters }: Props): any => {
  const {
    user: { role },
  } = useSession()
  let teamSubdomain = service ? `${service.name}.team-${team.teamId}` : ''
  let defaultSubdomain
  if (service && service.ingress && service.clusterId) {
    defaultSubdomain = `${teamSubdomain}.${service.clusterId.split('/')[1]}`
    // eslint-disable-next-line no-param-reassign
    service.ingress.useDefaultSubdomain = service.ingress.subdomain === defaultSubdomain
  }

  const crudOperation = service && service.id ? 'update' : 'create'
  const originalSchema = getServiceSchema(team, clusters, service)
  const originalUiSchema = getServiceUiSchema(originalSchema, role, service, crudOperation)
  const [schema, setSchema] = useState(originalSchema)
  const [uiSchema, setUiSchema] = useState(originalUiSchema)
  const [data, setData]: any = useState(service)
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
    // setData(formData)
    // if (!data) return
    if (!isEmpty(formData.ingress)) {
      if (
        formData.clusterId !== data.clusterId &&
        formData.ingress.domain !== '' &&
        formData.ingress.subdomain !== ''
      ) {
        // Enforce user to make a conscious choice for public URL whenever cluster changes
        formData.ingress = { ...formData.ingress }
        formData.ingress.domain = ''
        formData.ingress.subdomain = formData.ingress.useDefaultSubdomain ? defaultSubdomain : ''
      }
      if (
        formData.ingress.useDefaultSubdomain ||
        formData.name !== data.name ||
        formData.ingress.domain !== data.ingress.domain
      ) {
        // Set default subdomain of domain change
        formData.ingress = { ...formData.ingress }
        formData.ingress.subdomain = formData.ingress.useDefaultSubdomain ? defaultSubdomain : ''
      }
      setSchema(getServiceSchema(team, clusters, formData))
      setUiSchema(getServiceUiSchema(schema, role, formData, crudOperation))
    }
    setData(formData)

    // const { schema: s, uiSchema: u, formData: f } = processForm(
    //   originalSchema,
    //   originalUiSchema,
    //   schema,
    //   uiSchema,
    //   formData,
    // )
    // setSchema(s)
    // setUiSchema(u)
    // setData(f)
    setDirty(!isEqual(formData, service))
  }
  const handleSubmit = ({ formData }): any => {
    onSubmit(formData)
  }

  return (
    <div>
      <h1>{data && data.id ? `Service: ${data.name}` : 'New Service'}</h1>
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
        // ArrayFieldTemplate={ArrayFieldTemplate}
        // FieldTemplate={FieldTemplate}
      >
        <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
          <Button variant='contained' color='primary' type='submit' disabled={!dirty || invalid}>
            Submit
          </Button>
          &nbsp;
          {service && service.id && (
            <DeleteButton onDelete={onDelete} resourceName={data.name} resourceType='service' />
          )}
        </Box>
      </Form>
    </div>
  )
}
