import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetPolicyApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import { Box, Button } from '@mui/material'
import Form from './rjsf/Form'

export const getPolicySchema = (policyId): any => {
  const schema = cloneDeep(getSpec().components.schemas.Policies.properties[policyId])
  return schema
}

export const getPolicyUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'policy')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  policy?: GetPolicyApiResponse
  onSubmit: (formData: any) => void
  editPolicies: boolean
  policyId?: string
}

export default function ({ policy, teamId, onSubmit, editPolicies, policyId, ...other }: Props): React.ReactElement {
  const { user } = useSession()
  const [data, setData] = useState<GetPolicyApiResponse>(policy)
  useEffect(() => {
    setData(policy)
  }, [policy])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getPolicySchema(policyId)
  const uiSchema = getPolicyUiSchema(user, teamId)
  return (
    <Box>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onChange={setData}
        resourceType='Policy'
        children
        {...other}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button variant='contained' onClick={() => onSubmit(formData)} disabled={!editPolicies}>
          Submit
        </Button>
      </Box>
    </Box>
  )
}
