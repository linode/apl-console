import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSecretApiResponse, GetSessionApiResponse, GetTeamsApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getSecretSchema = (
  core: GetSessionApiResponse['core'],
  isAdmin: boolean,
  teams: GetTeamsApiResponse | Record<string, any>[] = [],
): any => {
  const schema = cloneDeep(getSpec().components.schemas.Secret)
  const {
    k8s: { namespaces },
  } = core
  set(
    schema,
    'properties.namespaces.items.enum',
    namespaces.map((t) => t.name),
  )
  set(schema, 'properties.namespaces.uniqueItems', true)
  set(
    schema,
    'properties.teams.items.enum',
    teams.map((t) => t.name),
  )
  set(schema, 'properties.teams.uniqueItems', true)
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
  teams: GetTeamsApiResponse
  teamId: string
  secret?: GetSecretApiResponse
}

export default function ({ teams, secret, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, core, user } = useSession()
  const [data, setData]: any = useState(secret)
  useEffect(() => {
    setData(secret)
  }, [secret])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getSecretSchema(core, user.isAdmin, teams)
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
