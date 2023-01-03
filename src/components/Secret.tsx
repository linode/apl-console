import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSecretApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getSecretSchema = (isAdmin: boolean): any => {
  const schema = cloneDeep(getSpec().components.schemas.Secret)
  if (!isAdmin) {
    delete schema.properties.clusterWide
    delete schema.properties.namespaces
  }
  return schema
}

export const getSecretUiSchema = (
  user: GetSessionApiResponse['user'],
  teamId: string,
  secret: GetSecretApiResponse | Record<string, any> = {},
): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
  }
  if (secret.clusterWide) {
    set(uiSchema, 'namespaces.ui:disabled', true)
    set(uiSchema, 'teamsWide.ui:disabled', true)
    set(uiSchema, 'teams.ui:disabled', true)
  } else if (secret.teamsWide) {
    set(uiSchema, 'namespaces.ui:disabled', true)
    set(uiSchema, 'teams.ui:disabled', true)
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
  const schema = getSecretSchema(user.isAdmin)
  const uiSchema = getSecretUiSchema(user, teamId, data)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.vault}
      resourceType='Secret'
      {...other}
    />
  )
}
