import { Button } from '@material-ui/core'
import Form from '@rjsf/material-ui'
import React from 'react'
import { getSchema } from '../hooks/api'
import { useSession } from '../session-context'

export default ({ onSubmit, clusters, service = {} }): any => {
  const { isAdmin } = useSession()
  const role = isAdmin ? 'admin' : 'team'
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
        formData={service}
        liveValidate={false}
        showErrorList={true}
      >
        <Button color='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  )
}
