import { Box, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Form from '@rjsf/material-ui'
import { isEmpty, cloneDeep } from 'lodash/lang'
import React, { useState } from 'react'
import Service from '../models/Service'
import { useSession } from '../session-context'
import { getServiceSchema, getServiceUiSchema } from '../api-spec'

interface Props {
  onSubmit: CallableFunction
  onDelete?: any
  team: any
  clusterId: string
  service?: Service
  clusters: [any]
}

export default ({ onSubmit, onDelete = null, team, service = null, clusters }: Props): any => {
  const { isAdmin } = useSession()
  const role = isAdmin ? 'admin' : 'team'

  const formSchema = getServiceSchema(team, clusters, service)
  const formUiSchema = getServiceUiSchema(formSchema, role)
  const [uiSchema] = useState(formUiSchema)
  const [schema, setSchema] = useState(formSchema)

  const [data, setData]: any = useState(service)
  const [dirty, setDirty] = useState(false)
  const [done, setDone] = useState(false)
  const handleChange = (form, error): any => {
    if (error) {
      return
    }

    if (!data) {
      // On rendering form for a new service when defaults are populated for the first time
      setData(form.formData)
      return
    }

    const formData = { ...form.formData }

    let schemaChanged = false
    if (formData.clusterId !== data.clusterId) {
      schemaChanged = true
    }
    if (!isEmpty(formData.ingress)) {
      if (
        formData.clusterId !== data.clusterId &&
        formData.ingress.domain !== '' &&
        formData.ingress.subdomain !== ''
      ) {
        // Enforce user to make a conscious choice for public URL whenever cluster changes
        formData.ingress = { ...formData.ingress }
        formData.ingress.domain = ''
        formData.ingress.subdomain = ''
      } else if (formData.name !== data.name || formData.ingress.domain !== data.ingress.domain) {
        // Set default subdomain of domain change
        formData.ingress = { ...formData.ingress }
        formData.ingress.subdomain = formData.name ? `${formData.name}.team-${team.name}` : ''
      }
    }

    if (schemaChanged) setSchema(cloneDeep(getServiceSchema(team, clusters, formData)))
    setData(formData)

    if (!done) {
      setDone(true)
    } else {
      setDirty(true)
    }
  }
  const handleSubmit = ({ formData }): any => {
    onSubmit(formData)
  }
  return (
    <div className='Service'>
      <h1>Service:</h1>
      <Form
        key='createService'
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={data}
        liveValidate={false}
        showErrorList
      >
        <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
          {service && service.serviceId && (
            <Button variant='contained' color='primary' startIcon={<DeleteIcon />} onClick={onDelete}>
              Delete
            </Button>
          )}
          &nbsp;
          <Button variant='contained' color='primary' type='submit' disabled={!dirty}>
            Submit
          </Button>
        </Box>
      </Form>
    </div>
  )
}
