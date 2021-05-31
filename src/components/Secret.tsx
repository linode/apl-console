import { Box, Button } from '@material-ui/core'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import { Secret } from '@redkubes/otomi-api-client-axios'
import { getSecretSchema, getSecretUiSchema } from '../api-spec'
import { useSession } from '../session-context'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'
import Form from './rjsf/Form'
import DeleteButton from './DeleteButton'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  secret?: Secret
}

export default ({ onSubmit, onDelete, secret }: Props): React.ReactElement => {
  const { user, oboTeamId } = useSession()

  const crudOperation = 'create'
  const schema = getSecretSchema()
  const uiSchema = getSecretUiSchema(user, oboTeamId, crudOperation)
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
      title={
        <h1>
          {data && data.id ? `Secret: ${data.name}` : 'New Secret'}
          {!user.isAdmin || oboTeamId ? ` (team ${oboTeamId})` : ''}
        </h1>
      }
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
        &nbsp;
        {data && data.id && (
          <DeleteButton
            onDelete={() => onDelete(data.id)}
            resourceName={data.name}
            resourceType='service'
            dataCy='button-delete-service'
          />
        )}
      </Box>
    </Form>
  )
}
