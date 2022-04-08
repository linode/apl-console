/* eslint-disable no-nested-ternary */
import { getSpec } from 'common/api-spec'
import { cloneDeep, get } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import Form from './rjsf/Form'

const getPolicySchema = (policyId): any => {
  const schema = cloneDeep(get(getSpec(), `components.schemas.Settings.properties.policies.properties[${policyId}]`))
  switch (policyId) {
    default:
      break
  }
  return schema
}

interface Props extends CrudProps {
  policies: any
  policyId: string
}

export default function ({ policies, policyId, ...other }: Props): React.ReactElement {
  const { appsEnabled } = useSession()
  const [data, setData]: any = useState(policies[policyId])
  const formData = cloneDeep(data)
  const schema = getPolicySchema(policyId)
  useEffect(() => {
    setData(policies[policyId])
  }, [policyId, policies])
  return (
    <Form
      key={policyId}
      schema={schema}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.gatekeeper}
      resourceType='Policy'
      idProp={null}
      adminOnly
      {...other}
    />
  )
}
