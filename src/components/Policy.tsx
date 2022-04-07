/* eslint-disable no-nested-ternary */
import { getPolicySchema, getPolicyUiSchema } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  policies: any
  policyId: string
}

export default function ({ onSubmit, policies, policyId }: Props): React.ReactElement {
  const { appsEnabled, oboTeamId, user } = useSession()
  const [data, setData]: any = useState(policies[policyId])
  const formData = cloneDeep(data)
  const schema = getPolicySchema(policyId)
  const uiSchema = getPolicyUiSchema(policyId, user, oboTeamId)
  useEffect(() => {
    setData(policies[policyId])
  }, [policyId, policies])
  return (
    <Form
      key={policyId}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      data={formData}
      onChange={setData}
      disabled={!appsEnabled.gatekeeper}
      resourceType='Policy'
      idProp={null}
      adminOnly
    />
  )
}
