/* eslint-disable react/button-has-type */
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetSessionApiResponse } from 'redux/otomiApi'
import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import Form from './rjsf/Form'

export const getWorkloadValuesSchema = (selectedChart: any, valuesType: string): any => {
  const schema: any = cloneDeep(getSpec().components.schemas.WorkloadValues)
  const defaultServicePorts = [
    {
      name: 'http',
      port: 80,
      targetPort: 'http',
      protocol: 'TCP',
    },
  ]
  if (selectedChart === 'deployment') schema.properties.values.properties.servicePorts.default = defaultServicePorts
  if (selectedChart === 'ksvc') {
    schema.properties.values.properties.autoscaling.properties.minReplicas.default = 0
    delete schema.properties.values.properties.servicePorts
  }
  schema.properties.values.title = `${valuesType} values`
  return schema
}

export const getWorkloadValuesUiSchema = (
  user: GetSessionApiResponse['user'],
  teamId: string,
  valuesType: string,
): any => {
  const hidden = () => <div className='hiddenDiv' style={{ position: 'absolute' }} />
  const advancedFields = ['env', 'args', 'labels', 'annotations', 'secrets', 'files', 'secretMounts', 'servicePorts']
  const advancedUiSchema = advancedFields.reduce((acc: any, item: string) => {
    acc[`${item}`] = {
      'ui:widget': 'hidden',
      'ui:field': hidden,
      'ui:description': ' ',
    }
    return acc
  }, {})

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
      resources: {
        limits: valuesType !== 'Advanced' && { 'ui:widget': 'hidden' },
      },
      containerSecurityContext: valuesType !== 'Advanced' && { 'ui:widget': 'hidden' },
      serviceMonitor: valuesType !== 'Advanced' && { 'ui:widget': 'hidden' },
      ...(valuesType !== 'Advanced' && advancedUiSchema),
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

const workloadValuesTypes = ['Basic', 'Advanced']

interface Props extends CrudProps {
  teamId: string
  valuesData: any
  setValuesData: (formData: any) => void
  selectedChart: string
}

export default function ({ teamId, valuesData, setValuesData, selectedChart, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [valuesType, setValuesType] = useState('Basic')
  // END HOOKS
  const schema = getWorkloadValuesSchema(selectedChart, valuesType)
  const uiSchema = getWorkloadValuesUiSchema(user, teamId, valuesType)

  return (
    <Box sx={{ mt: '2rem' }}>
      <FormControl>
        <RadioGroup
          sx={{ display: 'flex', flexDirection: 'row' }}
          onChange={(e) => setValuesType(e.target.value)}
          value={valuesType}
        >
          {workloadValuesTypes.map((value: string) => (
            <FormControlLabel key={value} value={value} control={<Radio />} label={`${value} values`} />
          ))}
        </RadioGroup>
      </FormControl>
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
    </Box>
  )
}
