import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetBuildApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getBuildSchema = (teamId: string, formData?: any, repoUrls?: string[], secrets?: string[]): any => {
  const repoType = formData?.repoType?.type || 'internal'
  const mode = formData?.mode?.type || 'docker'
  const modeIndex = mode === 'buildpacks' ? 1 : 0
  const schema = cloneDeep(getSpec().components.schemas.Build)
  if (repoType === 'internal' && repoUrls.length > 0) {
    set(schema, `properties.mode.oneOf[${modeIndex}].properties.${mode}.properties.repoUrl.enum`, repoUrls)
    set(schema, `properties.mode.oneOf[${modeIndex}].properties.${mode}.properties.repoUrl.listNotShort`, true)
  }
  if (repoType === 'external' && secrets.length > 0) {
    set(schema, `properties.repoType.properties.external.properties.secretName.enum`, secrets)
    set(schema, `properties.repoType.properties.external.properties.secretName.listNotShort`, true)
  }
  return schema
}

export const getBuildUiSchema = (user: GetSessionApiResponse['user'], teamId: string, formData: any): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    repoType: {
      external:
        formData?.repoType?.type !== 'external'
          ? { 'ui:widget': 'hidden' }
          : {
              secretName: !formData?.repoType?.external?.private && { 'ui:widget': 'hidden' },
            },
    },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'build')
  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  build?: GetBuildApiResponse
  repoUrls?: string[]
  secrets?: string[]
}

export default function ({ build, teamId, repoUrls = [], secrets = [], ...other }: Props): React.ReactElement {
  const { user } = useSession()
  const [data, setData]: any = useState(build)
  useEffect(() => {
    setData(build)
  }, [build])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getBuildSchema(teamId, formData, repoUrls, secrets)
  const uiSchema = getBuildUiSchema(user, teamId, formData)
  return <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='Build' {...other} />
}
