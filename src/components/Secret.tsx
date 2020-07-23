import { Box, Button } from '@material-ui/core'
import Form from '@rjsf/material-ui'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import { getSecretSchema, getSecretUiSchema, addNamespaceEnum } from '../api-spec'
import Secret from '../models/Secret'
import { useSession } from '../session-context'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'

interface Props {
  onSubmit: CallableFunction
  secret?: Secret
  clusters: [any]
}

export default ({ onSubmit, secret }: Props): any => {
  const {
    user: { role },
    namespaces,
  } = useSession()

  const crudOperation = secret && secret.id ? 'update' : 'create'
  const schema = getSecretSchema()
  addNamespaceEnum(schema, namespaces)
  const uiSchema = getSecretUiSchema(schema, role, crudOperation)
  const [data, setData]: any = useState(secret)
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }): any => {
    setData(formData)
    setDirty(!isEqual(formData, secret))
  }
  const handleSubmit = ({ formData }): any => {
    onSubmit(formData)
  }

  return (
    <div>
      <h1>{data && data.secretId ? `Secret: ${data.name}` : 'New Secret'}</h1>
      <Form
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
          <Button variant='contained' color='primary' type='submit' disabled={!dirty}>
            Submit
          </Button>
        </Box>
      </Form>
    </div>
  )
}
