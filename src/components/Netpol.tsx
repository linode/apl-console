import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetNetpolApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getNetpolSchema = (teamId: string, formData: any): any => {
  const mode = formData?.ruleType?.ingress?.mode || 'AllowAll'
  const type = formData?.ruleType?.type || 'ingress'
  const schema = cloneDeep(getSpec().components.schemas.Netpol)
  if (teamId !== 'admin') delete schema.properties.namespace
  set(schema, 'properties.ruleType.properties.type.title', '')
  unset(schema, 'properties.ruleType.additionalProperties')
  if (mode === 'AllowAll' && type === 'ingress') {
    unset(schema, 'properties.ruleType.properties.ingress.properties.allow')
    unset(schema, 'properties.ruleType.properties.ingress.additionalProperties')
  }
  if (type === 'ingress') unset(schema, 'properties.ruleType.properties.egress')
  else unset(schema, 'properties.ruleType.properties.ingress')

  return schema
}

export const getNetpolUiSchema = (
  user: GetSessionApiResponse['user'],
  teamId: string,
  isNameEditable: boolean,
): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:readonly': !isNameEditable },
    teamId: { 'ui:widget': 'hidden' },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'netpol')
  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  netpol?: GetNetpolApiResponse
}

export default function ({ netpol, teamId, ...other }: Props): React.ReactElement {
  const { user } = useSession()
  const [data, setData]: any = useState(netpol)
  useEffect(() => {
    setData(netpol)
  }, [netpol])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getNetpolSchema(teamId, formData)
  const uiSchema = getNetpolUiSchema(user, teamId, !netpol?.name)
  return (
    <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='Netpol' {...other} />
  )
}
