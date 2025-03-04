import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetBuildApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getBuildSchema = (teamId: string): any => {
  const schema = cloneDeep(getSpec().components.schemas.Build)
  return schema
}

export const getBuildUiSchema = (user: GetSessionApiResponse['user'], teamId: string, formData: any): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    giteaWebHookId: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    secretName: !formData?.externalRepo && { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'build')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  build?: GetBuildApiResponse
}

export default function ({ build, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(build)
  useEffect(() => {
    setData(build)
  }, [build])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getBuildSchema(teamId)
  const uiSchema = getBuildUiSchema(user, teamId, formData)
  return <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='Build' {...other} />
}
