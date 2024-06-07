import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSecretApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getSecretSchema = (teamId: string): any => {
  const schema = cloneDeep(getSpec().components.schemas.Secret)
  if (teamId !== 'admin') delete schema.properties.namespace
  return schema
}

export const getSecretUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'secret')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  secret?: GetSecretApiResponse
}

export default function ({ secret, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(secret)
  useEffect(() => {
    setData(secret)
  }, [secret])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getSecretSchema(teamId)
  const uiSchema = getSecretUiSchema(user, teamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      disabled
      resourceType='Secret'
      {...other}
    />
  )
}
