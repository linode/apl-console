import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetBuildApiResponse, GetSecretsApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getBuildSchema = (teamId: string, secrets: Array<any>, formData: GetBuildApiResponse): any => {
  const schema = cloneDeep(getSpec().components.schemas.Build)
  if (formData?.secretSelect) {
    const genSecretNames = secrets.filter((s) => s.secret.type === 'tls').map((s) => s.name)
    set(schema, `secretName.enum`, genSecretNames)
    if (secrets.length === 1) schema.secretName = genSecretNames[0]
  }
  return schema
}

export const getBuildUiSchema = (user: GetSessionApiResponse['user'], teamId: string, formData?: any): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    secretSelect: !formData?.externalRepo && { 'ui:widget': 'hidden' },
    secretName: !formData?.externalRepo && { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'build')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  secrets: GetSecretsApiResponse
  build?: GetBuildApiResponse
}

export default function ({ build, teamId, secrets, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(build)
  useEffect(() => {
    setData(build)
  }, [build])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getBuildSchema(teamId, secrets, formData)
  const uiSchema = getBuildUiSchema(user, teamId, formData)
  return <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='Build' {...other} />
}
