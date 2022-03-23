import { Box, Button } from '@mui/material'
import { Secret } from '@redkubes/otomi-api-client-axios'
import { getSecretSchema, getSecretUiSchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import DeleteButton from './DeleteButton'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  secret?: Secret
}

export default function ({ onSubmit, onDelete, secret }: Props): React.ReactElement {
  const { appsEnabled, user, oboTeamId } = useSession()

  const schema = getSecretSchema()
  const uiSchema = getSecretUiSchema(user, oboTeamId)
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
      disabled={!appsEnabled.vault}
    >
      <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
        <Button type='submit' disabled={!dirty} data-cy='button-submit-secret'>
          Submit
        </Button>
        &nbsp;
        {data && data.id && (
          <DeleteButton
            onDelete={() => onDelete(data.id)}
            resourceName={data.name}
            resourceType='secret'
            dataCy='button-delete-secret'
          />
        )}
      </Box>
    </Form>
  )
}
