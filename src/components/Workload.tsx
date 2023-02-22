import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetWorkloadApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getWorkloadSchema = (teamId: string): any => {
  const schema = cloneDeep(getSpec().components.schemas.Workload)
  return schema
}

export const getWorkloadUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'workload')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  workload?: GetWorkloadApiResponse
}

export default function ({ workload, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(workload)
  useEffect(() => {
    setData(workload)
  }, [workload])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getWorkloadSchema(teamId)
  const uiSchema = getWorkloadUiSchema(user, teamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.argocd}
      resourceType='Workload'
      {...other}
    />
  )
}
