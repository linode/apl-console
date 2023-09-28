/* eslint-disable react/button-has-type */

import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { GetSessionApiResponse, GetWorkloadApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getWorkloadSchema = (): any => {
  const schema = cloneDeep(getSpec().components.schemas.Workload)
  return schema
}

export const getWorkloadUiSchema = (user: GetSessionApiResponse['user'], teamId: string, isGitea = false): any => {
  const custom = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    selectedChart: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    autoUpdate: { 'ui:readonly': !isGitea, strategy: { 'ui:readonly': !isGitea } },
  }
  const preDefined = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    url: { 'ui:widget': 'hidden' },
    path: { 'ui:widget': 'hidden' },
    chart: { 'ui:widget': 'hidden' },
    revision: { 'ui:widget': 'hidden' },
    namespace: { 'ui:widget': 'hidden' },
    selectedChart: { 'ui:widget': 'hidden' },
    autoUpdate: { 'ui:widget': 'hidden' },
  }
  const uiSchema = { custom, preDefined }
  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

export const isGiteaURL = (url: string) => {
  let hostname = ''
  if (url) {
    try {
      hostname = new URL(url).hostname
    } catch (e) {
      // ignore
      return false
    }
  }
  const giteaPattern = /^gitea\..+/i
  return giteaPattern.test(hostname)
}

interface Props extends CrudProps {
  workload?: GetWorkloadApiResponse
  teamId: string
  data: any
  setData: (formData: any) => void
  selectedChart: string
}

export default function ({ workload, teamId, data, setData, selectedChart, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  useEffect(() => {
    setData(workload)
  }, [workload])
  // END HOOKS
  const schema = getWorkloadSchema()
  if (workload?.selectedChart !== 'custom') schema.required.push('url')
  const isGitea = isGiteaURL(data?.url)
  const uiSchema = getWorkloadUiSchema(user, teamId, isGitea)

  return (
    <Form
      schema={schema}
      uiSchema={selectedChart === 'deployment' || selectedChart === 'ksvc' ? uiSchema.preDefined : uiSchema.custom}
      data={data}
      onChange={setData}
      disabled={!appsEnabled.argocd || (workload?.selectedChart !== 'custom' && !!workload?.id)}
      resourceType='Workload'
      children
      hideHelp
      {...other}
    />
  )
}
