import { Box, Button } from '@material-ui/core'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import { Secret } from '@redkubes/otomi-api-client-axios'
import { getSecretSchema, getSecretUiSchema, addNamespaceEnum } from '../api-spec'
import { useSession } from '../session-context'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  secret?: Secret
}

export default ({ onSubmit, secret }: Props) => {
  const {
    user: { roles },
    namespaces,
  } = useSession()

  const crudOperation = 'create'
  const schema = getSecretSchema()
  addNamespaceEnum(schema, namespaces)
  const uiSchema = getSecretUiSchema(schema, roles, crudOperation)
  const [data, setData]: any = useState(secret)
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    setData(formData)
    setDirty(!isEqual(formData, secret))
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
  }

  return (
    <Form
      title={<h1>{data && data.secretId ? `Secret: ${data.name}` : 'New Secret'}</h1>}
      key='createSecret'
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
        <Button variant='contained' color='primary' type='submit' disabled={!dirty} data-cy='button-submit-secret'>
          Submit
        </Button>
      </Box>
    </Form>
  )
}
