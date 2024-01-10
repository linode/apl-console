import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetPolicyApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getPolicySchema = (teamId: string, hasCustomValues: boolean): any => {
  const schema = cloneDeep(getSpec().components.schemas.Policy)
  if (!hasCustomValues) unset(schema, 'properties.customValues')
  return schema
}

export const getPolicyUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'policy')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  policy?: GetPolicyApiResponse
}

export default function ({ policy, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(policy)
  useEffect(() => {
    setData(policy)
  }, [policy])
  // END HOOKS
  const formData = cloneDeep(data)
  const hasCustomValues = formData?.customValues?.length > 0
  const schema = getPolicySchema(teamId, hasCustomValues)
  const uiSchema = getPolicyUiSchema(user, teamId)
  return (
    <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='Policy' {...other} />
  )
}
