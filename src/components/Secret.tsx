import { getSecretSchema, getSecretUiSchema } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetSecretApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  secret?: GetSecretApiResponse
}

export default function ({ onSubmit, onDelete, secret }: Props): React.ReactElement {
  const { appsEnabled, user, oboTeamId } = useSession()
  const [data, setData]: any = useState(secret)
  const formData = cloneDeep(data)
  const schema = getSecretSchema()
  const uiSchema = getSecretUiSchema(user, oboTeamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      onDelete={onDelete}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.vault}
      resourceType='Secret'
    />
  )
}
