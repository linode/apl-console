import { Box, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Form from '@rjsf/material-ui'
import { isEmpty, isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import ObjectFieldTemplate from './FormTemplate'
import Service from '../models/Service'
import { useSession } from '../session-context'
import { getServiceSchema, getServiceUiSchema } from '../api-spec'

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

  let defaultSubdomain = service ? `${service.name}.team-${team.teamId}` : ''
  // eslint-disable-next-line no-param-reassign
  if (service && service.ingress) service.ingress.useDefaultSubdomain = service.ingress.subdomain === defaultSubdomain

  const originalSchema = getServiceSchema(team, clusters, service)
  const originalUiSchema = getServiceUiSchema(originalSchema, role, service)
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
        if (formData.name) defaultSubdomain = `${formData.name}.team-${team.teamId}`
        // Set default subdomain of domain change
        formData.ingress = { ...formData.ingress }
        formData.ingress.subdomain = formData.ingress.useDefaultSubdomain ? defaultSubdomain : ''
      }
      setSchema(getServiceSchema(team, clusters, formData))
      setUiSchema(getServiceUiSchema(schema, role, formData))
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
    <div className='Service'>
      <h1>{data && data.serviceId ? `Service: ${data.name}` : 'New Service'}</h1>
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
        // FieldTemplate={CustomFieldTemplate}
        // ArrayFieldTemplate={CustomArrayFieldTemplate}
      >
        <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
          {service && service.serviceId && (
            <Button variant='contained' color='primary' startIcon={<DeleteIcon />} onClick={onDelete}>
              Delete
            </Button>
          )}
          &nbsp;
          <Button variant='contained' color='primary' type='submit' disabled={!dirty || invalid}>
            Submit
          </Button>
        </Box>
      </Form>
    </div>
  )
}
