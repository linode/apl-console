import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { get } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GetPolicyApiResponse, GetSessionApiResponse } from 'redux/otomiApi'
import HeaderTitle from './HeaderTitle'

export const getPolicyUiSchema = (user: GetSessionApiResponse['user'], teamId: string): Record<string, unknown> => {
  const uiSchema = {}
  applyAclToUiSchema(uiSchema, user, teamId, 'policy')
  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  policy?: GetPolicyApiResponse
  onSubmit: (formData: GetPolicyApiResponse) => void
  editPolicies: boolean
  policyName?: string
}

const withDefaults = (policy?: GetPolicyApiResponse): GetPolicyApiResponse | undefined =>
  policy && { ...policy, action: policy.action ?? 'Audit', severity: policy.severity ?? 'medium' }

export default function Policy({
  policy,
  teamId,
  onSubmit,
  editPolicies,
  policyName,
  mutating,
}: Props): React.ReactElement {
  const { user, oboTeamId } = useSession()
  const { t } = useTranslation()
  const [data, setData] = useState<GetPolicyApiResponse>(withDefaults(policy))

  useEffect(() => {
    setData(withDefaults(policy))
  }, [policy, policyName])

  const schema = getSpec().components.schemas.Policies.properties[policyName]
  if (!schema || typeof schema !== 'object') throw new Error(`Unknown policy schema: ${policyName}`)
  const uiSchema = getPolicyUiSchema(user, teamId)
  const readonly = (field: string) => Boolean(get(uiSchema, `${field}.ui:readonly`))
  const disabled = !data || mutating || !editPolicies
  const customValuesSchema = schema.properties?.customValues
  const showCustomValues = Boolean(customValuesSchema && typeof customValuesSchema === 'object')
  const docPath = schema['x-externalDocsPath']

  return (
    <Box>
      <HeaderTitle
        title={t('FORM_TITLE_TEAM', { model: t('Policy'), name: policyName, teamId: oboTeamId })}
        resourceType='Policy'
        docUrl={docPath ? `https://techdocs.akamai.com/app-platform/docs/${docPath}` : undefined}
      />
      {schema.description && <Typography sx={{ mb: 2 }}>{schema.description}</Typography>}
      {showCustomValues && (
        <Box sx={{ mb: 2 }}>
          <Typography variant='h6'>Custom values</Typography>
          {(data?.customValues ?? []).map((value, index) => (
            // Values are editable and are not unique; their position is their identity.
            // eslint-disable-next-line react/no-array-index-key
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TextField
                label={`Custom value ${index + 1}`}
                value={value}
                disabled={disabled || readonly('customValues')}
                onChange={(event) => {
                  const customValues = [...data.customValues]
                  customValues[index] = event.target.value
                  setData({ ...data, customValues })
                }}
              />
              <IconButton
                aria-label={`Remove custom value ${index + 1}`}
                disabled={disabled || readonly('customValues')}
                onClick={() => setData({ ...data, customValues: data.customValues.filter((_, i) => i !== index) })}
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            type='button'
            disabled={disabled || readonly('customValues')}
            onClick={() => setData({ ...data, customValues: [...(data.customValues ?? []), ''] })}
          >
            Add custom value
          </Button>
        </Box>
      )}
      <FormControl component='fieldset' disabled={disabled || readonly('action')} sx={{ display: 'block', mb: 2 }}>
        <FormLabel component='legend'>Action</FormLabel>
        <RadioGroup
          row
          value={data?.action ?? 'Audit'}
          onChange={(_, value: GetPolicyApiResponse['action']) => setData({ ...data, action: value })}
        >
          <FormControlLabel value='Audit' control={<Radio />} label='Audit' />
          <FormControlLabel value='Enforce' control={<Radio />} label='Enforce' />
        </RadioGroup>
      </FormControl>
      <FormControl component='fieldset' disabled={disabled || readonly('severity')} sx={{ display: 'block' }}>
        <FormLabel component='legend'>Severity</FormLabel>
        <RadioGroup
          row
          value={data?.severity ?? 'medium'}
          onChange={(_, value: GetPolicyApiResponse['severity']) => setData({ ...data, severity: value })}
        >
          <FormControlLabel value='low' control={<Radio />} label='low' />
          <FormControlLabel value='medium' control={<Radio />} label='medium' />
          <FormControlLabel value='high' control={<Radio />} label='high' />
        </RadioGroup>
      </FormControl>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          variant='contained'
          disabled={disabled}
          onClick={() =>
            onSubmit({
              ...data,
              ...(data.customValues && { customValues: data.customValues.filter((value) => value !== '') }),
            })
          }
        >
          Submit
        </Button>
      </Box>
    </Box>
  )
}
