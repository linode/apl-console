import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetSourceApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getSourceSchema = (teamId: string): any => {
  const schema = cloneDeep(getSpec().components.schemas.Source)
  return schema
}

export const getSourceUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'source')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  source?: GetSourceApiResponse
}

export default function ({ source, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(source)
  useEffect(() => {
    setData(source)
  }, [source])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getSourceSchema(teamId)
  const uiSchema = getSourceUiSchema(user, teamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.velero}
      resourceType='Source'
      {...other}
    />
  )
}
