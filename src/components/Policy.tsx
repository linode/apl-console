/* eslint-disable no-nested-ternary */
import { Box, Button } from '@mui/material'
import { getPolicySchema, getPolicyUiSchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import { isEmpty, isEqual } from 'lodash'
import React, { useEffect, useState } from 'react'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  policies: any
  policyId: string
}

export default function ({ onSubmit, policies, policyId }: Props): React.ReactElement {
  const [data, setData]: any = useState(policies[policyId])
  const [schema, setSchema] = useState({})
  const [uiSchema, setUiSchema] = useState()
  const { appsEnabled, oboTeamId, user } = useSession()
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    const newSchema = getPolicySchema(policyId)
    setSchema(newSchema)
    const newUiSchema = getPolicyUiSchema(policyId, user, oboTeamId)
    setUiSchema(newUiSchema)
    setData(formData)
    const isDirty = !isEqual(formData, policies[policyId] || {})
    setDirty(isDirty)
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
    setDirty(false)
  }
  useEffect(() => {
    setData(policies[policyId])
    setSchema({})
  }, [policyId, policies])

  if (isEmpty(schema) || !uiSchema) {
    handleChange({ formData: data || {} })
    return null
  }

  return (
    <>
      <h1 data-cy='h1-edit-policy-page'>Policy:</h1>
      <Form
        key={policyId}
        id={policyId}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={data}
        hideHelp
        disabled={!appsEnabled.gatekeeper}
      >
        <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
          <Button type='submit' disabled={!dirty} data-cy={`button-submit-${policyId}`}>
            Submit
          </Button>
        </Box>
      </Form>
    </>
  )
}
