import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetUserApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'
import InformationBanner from './InformationBanner'

export const getUserSchema = (teamIds: string[]): any => {
  const schema = cloneDeep(getSpec().components.schemas.User) as any
  if (teamIds?.length === 0) {
    unset(schema, 'properties.teams')
    return schema
  }
  schema.properties.teams.items.enum = [...teamIds]
  schema.properties.teams.default = []
  return schema
}

export const getUserUiSchema = (
  user: GetSessionApiResponse['user'],
  formData: GetUserApiResponse,
  teamId: string,
): any => {
  const platformAdmin = formData?.isPlatformAdmin || false
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    isTeamAdmin: platformAdmin && { 'ui:widget': 'hidden' },
    teams: platformAdmin && { 'ui:widget': 'hidden' },
    initialPassword: { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'user')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  user?: GetUserApiResponse
  teamIds?: string[]
}

export default function ({ user, teamId, teamIds, ...other }: Props): React.ReactElement {
  const {
    user: sessionUser,
    settings: {
      otomi: { hasExternalIDP },
      cluster: { domainSuffix },
    },
  } = useSession()
  const [data, setData] = useState<GetUserApiResponse>(user)
  useEffect(() => {
    setData(user)
  }, [user])
  // END HOOKS
  const formData = cloneDeep(data)
  if (formData?.isPlatformAdmin) {
    formData.isTeamAdmin = false
    formData.teams = []
  }
  const schema = getUserSchema(teamIds)
  const uiSchema = getUserUiSchema(sessionUser, formData, teamId)
  const defaultPlatformAdminEmail = `platform-admin@${domainSuffix}`
  if (hasExternalIDP) {
    return (
      <InformationBanner message='User management is only available when using the internal identity provider (IDP).' />
    )
  }
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      resourceType='User email'
      title={user?.email ? `User: (${user.email})` : 'New User'}
      resourceName={user?.email}
      deleteDisabled={user?.email === defaultPlatformAdminEmail}
      {...other}
    />
  )
}
