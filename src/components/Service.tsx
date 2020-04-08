import { Box, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Form from '@rjsf/material-ui'
import { isEmpty, isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import Service from '../models/Service'
import { useSession } from '../session-context'
import { getServiceSchema, getServiceUiSchema } from '../api-spec'

interface Props {
  onSubmit: CallableFunction
  onDelete?: any
  team: any
  service?: Service
}

// function getSchema(allClusters, formData, role) {
//   const schema = s.getServiceSchema(team, allClusters, formData)

//   return { formData, schema, uiSchema }
// }

// function getUiSchema() {
//   const s = getSchema()
//   const uiSchema = s.getServiceUiSchema(schema, role)
// }

export default ({ onSubmit, onDelete = null, team, service = null }: Props): any => {
  const { isAdmin } = useSession()
  const role = isAdmin ? 'admin' : 'team'
  const formSchema = getServiceSchema(team.clusters)
  const formUiSchema = getServiceUiSchema(formSchema, role)

  const [uiSchema] = useState(formUiSchema)
  const [schema] = useState(formSchema)

  const [data, setData] = useState(service)
  // The round state is used to force form rendering
  const [round, setRound] = useState(false)

  const [dirty, setDirty] = useState(false)
  const [done, setDone] = useState(false)
  const handleChange = (form, error): any => {
    if (error) {
      return
    }

    const { formData } = form
    const equal = isEqual(formData, data)

    if (equal) {
      return
    }

    if (!isEmpty(formData.ingress)) {
      if (formData.clusterId !== data.clusterId) {
        // Enforce user to make a conscious choice for public URL whenever cluster changes
        formData.ingress.domain = ''
        formData.ingress.subdomain = ''
      } else if (formData.ingress.domain !== data.ingress.domain) {
        // Set default subdomain of domain change
        formData.ingress.subdomain = `${formData.name}.team-${team.name}`
      } else if (formData.name !== data.name) {
        // Enforce user to make a conscious choice for public URL whenever service name changes
        formData.ingress.domain = ''
        formData.ingress.subdomain = ''
        // formData.ingress.subdomain = `${formData.name}/team-${formData.teamId}`
      }
    }

    setRound(!round)
    setData(formData)

    if (!done) {
      setDone(true)
    } else {
      setDirty(!equal)
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
        formContext={{ workaround: round }}
      >
        <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
          {service && service.serviceId && (
            <Button variant='contained' color='primary' startIcon={<DeleteIcon />} onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button variant='contained' color='primary' type='submit' disabled={!dirty}>
            Submit
          </Button>
        </Box>
      </Form>
    </div>
  )
}
