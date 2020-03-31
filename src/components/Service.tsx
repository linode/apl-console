import { Button } from '@material-ui/core'
import React from 'react'
import { withTheme } from 'react-jsonschema-form'
import { Theme as MuiTheme } from 'rjsf-material-ui'
import { getSchema } from '../hooks/api'

const Form = withTheme(MuiTheme)

export default ({ onSubmit, clusters, service = {} }): any => {
  const handleSubmit = ({ schema, uiSchema, formData, edit, errors }): any => {
    onSubmit(formData)
  }
  const schema = getSchema()
  const mySchema = schema.getServiceSchema(clusters)
  const uiSchema = schema.getServiceUiSchema(mySchema)
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
