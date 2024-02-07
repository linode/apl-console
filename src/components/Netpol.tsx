import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetNetpolApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getNetpolSchema = (teamId: string): any => {
  const schema = cloneDeep(getSpec().components.schemas.Netpol)
  if (teamId !== 'admin') delete schema.properties.namespace
  return schema
}

export const getNetpolUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'netpol')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  netpol?: GetNetpolApiResponse
}

export default function ({ netpol, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(netpol)
  useEffect(() => {
    setData(netpol)
  }, [netpol])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getNetpolSchema(teamId)
  const uiSchema = getNetpolUiSchema(user, teamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.vault}
      resourceType='Netpol'
      {...other}
    />
  )
}
