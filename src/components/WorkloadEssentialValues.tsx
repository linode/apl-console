/* eslint-disable react/button-has-type */
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { GetSessionApiResponse, useGetWorkloadValuesQuery } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getWorkloadValuesSchema = (): any => {
  const schema = cloneDeep(getSpec().components.schemas.WorkloadValues)
  return schema
}

export const getWorkloadValuesUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    name: { 'ui:widget': 'hidden' },
    values: {
      fullnameOverride: { 'ui:widget': 'hidden' },
      containerPorts: {
        name: { 'ui:widget': 'hidden' },
        protocol: { 'ui:widget': 'hidden' },
      },
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

interface Props extends CrudProps {
  workloadId: string
  teamId: string
  setData: any
}

export default function ({ workloadId, teamId, setData, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const { data } = useGetWorkloadValuesQuery({ teamId, workloadId }, { skip: !workloadId })
  useEffect(() => {
    setData(data)
  }, [data])
  // END HOOKS
  const schema = getWorkloadValuesSchema()
  const uiSchema = getWorkloadValuesUiSchema(user, teamId)

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={data}
      onChange={setData}
      disabled={!appsEnabled.argocd}
      resourceType='Workload'
      children
      hideHelp
      {...other}
    />
  )
}
