/* eslint-disable react/button-has-type */
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React from 'react'
import { GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getWorkloadValuesSchema = (selectedChart): any => {
  const schema = cloneDeep(getSpec().components.schemas.WorkloadValues)
  if (selectedChart === 'ksvc')
    schema.properties.values.properties.scaleToZero = { type: 'boolean', default: true, title: 'Scale to Zero' }
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
        items: {
          name: { 'ui:widget': 'hidden' },
          protocol: { 'ui:widget': 'hidden' },
        },
        'ui:options': {
          addable: false,
          removable: false,
        },
      },
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  valuesData: any
  setValuesData: (formData: any) => void
  selectedChart: string
}

export default function ({ teamId, valuesData, setValuesData, selectedChart, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  // END HOOKS
  const schema = getWorkloadValuesSchema(selectedChart)
  const uiSchema = getWorkloadValuesUiSchema(user, teamId)

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={valuesData}
      onChange={setValuesData}
      disabled={!appsEnabled.argocd}
      resourceType='Workload'
      children
      hideHelp
      {...other}
    />
  )
}
