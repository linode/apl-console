import { Box, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Form from '@rjsf/material-ui'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import { getSchema } from '../hooks/api'
import Service from '../models/Service'
import { useSession } from '../session-context'

interface Props {
  onSubmit: CallableFunction
  onDelete?: any
  clusters: [string]
  service?: Service
}

export default ({ onSubmit, onDelete = null, clusters, service = null }: Props): any => {
  const { isAdmin } = useSession()
  const role = isAdmin ? 'admin' : 'team'
  const [data, setData] = useState(service)
  const [dirty, setDirty] = useState(false)
  const [done, setDone] = useState(false)
  const handleChange = (form, error): any => {
    if (!error) {
      const { formData } = form
      const equal = isEqual(formData, service)
      setData(formData)
      if (!done) {
        setDone(true)
      } else {
        setDirty(!equal)
      }
    }
  }
  const handleSubmit = ({ schema, uiSchema, formData, edit, errors }): any => {
    onSubmit(formData)
  }
  const schema = getSchema()
  const mySchema = schema.getServiceSchema(clusters)
  const uiSchema = schema.getServiceUiSchema(mySchema, role)
  return (
    <div className='Service'>
      <h2>Service:</h2>
      <Form
        key='createService'
        schema={mySchema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={data}
        liveValidate={false}
        showErrorList={true}
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
