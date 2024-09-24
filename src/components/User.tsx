import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetUserApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getUserSchema = (): any => {
  const schema = cloneDeep(getSpec().components.schemas.TeamUser)
  // console.log('schema', schema)
  return schema
}

export const getUserUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'user')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  user?: GetUserApiResponse
}

export default function ({ user, teamId, ...other }: Props): React.ReactElement {
  const { user: sessionUser } = useSession()
  console.log('sessionUser', sessionUser)
  const [data, setData]: any = useState(user)
  useEffect(() => {
    setData(user)
  }, [user])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getUserSchema()
  const uiSchema = getUserUiSchema(sessionUser, teamId)
  return <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='User' {...other} />
}
