import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetWorkloadApiResponse, useGetTeamWorkloadsQuery } from 'redux/otomiApi'
import { createCapabilities } from 'utils/permission'
import Form from './rjsf/Form'
import InformationBanner from './InformationBanner'

export const getWorkloadSchema = (teamId: string): any => {
  const schema = cloneDeep(getSpec().components.schemas.Workload)
  return schema
}

export const getWorkloadUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'workload')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  workload?: GetWorkloadApiResponse
}

export default function ({ workload, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user, license } = useSession()
  const allSessionData = useSession()
  const [data, setData]: any = useState(workload)
  useEffect(() => {
    setData(workload)
  }, [workload])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getWorkloadSchema(teamId)
  const uiSchema = getWorkloadUiSchema(user, teamId)
  const workloads = useGetTeamWorkloadsQuery({ teamId }, { skip: !teamId })
  return (
    <>
      {!createCapabilities(workloads.data?.length, license.body.capabilities.workloads) && (
        <InformationBanner message='Max amount of workloads reached for this license.' />
      )}

      <Form
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onChange={setData}
        disabled={
          !appsEnabled.argocd || !createCapabilities(workloads.data?.length, license.body.capabilities.workloads)
        }
        resourceType='Workload'
        {...other}
      />
    </>
  )
}
