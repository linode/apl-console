import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetUserApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getUserSchema = (teamId: string, teamIds: string[]): any => {
  const schema = cloneDeep(getSpec().components.schemas.User) as any
  schema.properties.teams.items.enum = [...teamIds]
  schema.properties.teams.default = [teamId]
  return schema
}

export const getUserUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    isPlatformAdmin: !user.isPlatformAdmin && { 'ui:widget': 'hidden' },
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
  const { user: sessionUser } = useSession()
  const [data, setData]: any = useState(user)
  useEffect(() => {
    setData(user)
  }, [user])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getUserSchema(teamId, teamIds)
  const uiSchema = getUserUiSchema(sessionUser, teamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      resourceType='User email'
      title={user?.email ? `User: (${user.email})` : 'New User'}
      resourceName={user?.email}
      {...other}
    />
  )
}
