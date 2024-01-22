import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetPolicyApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import { Box, Button } from '@mui/material'
import Form from './rjsf/Form'

export const getPolicySchema = (teamId: string, hasCustomValues: boolean, formData: any): any => {
  const schema = cloneDeep(getSpec().components.schemas.Policy)
  if (!hasCustomValues) unset(schema, 'properties.customValues')
  set(schema, 'properties.description.type', 'null')
  set(schema, 'properties.description.title', 'Description')
  set(schema, 'properties.description.default', formData?.description)
  return schema
}

export const getPolicyUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    name: { 'ui:widget': 'hidden' },
    profile: { 'ui:widget': 'hidden' },
    description: { 'ui:readonly': true, 'ui:widget': 'textarea' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'policy')

  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  policy?: GetPolicyApiResponse
  onSubmit: (formData: any) => void
  editPolicies: boolean
}

export default function ({ policy, teamId, onSubmit, editPolicies, ...other }: Props): React.ReactElement {
  const { appsEnabled, user } = useSession()
  const [data, setData]: any = useState(policy)
  useEffect(() => {
    setData(policy)
  }, [policy])
  // END HOOKS
  const formData = cloneDeep(data)
  // console.log('formData', formData)
  const hasCustomValues = formData?.customValues?.length > 0
  const schema = getPolicySchema(teamId, hasCustomValues, formData)
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
