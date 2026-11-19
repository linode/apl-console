import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material'
import { getSpec } from 'common/api-spec'
import InformationBanner from 'components/InformationBanner'
import { LandingHeader } from 'components/LandingHeader'
import Section from 'components/Section'
import { TextField } from 'components/forms/TextField'
import PaperLayout from 'layouts/Paper'
import { isEqual, omit } from 'lodash'
import { useSession } from 'providers/Session'
import { useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { GetPolicyApiResponse, useEditPolicyMutation, useGetAplTeamsQuery, useGetPolicyQuery } from 'redux/otomiApi'
import snack from 'utils/snack'
import { PolicyFormValues, policySchema, supportsCustomValues } from './create-edit-policies.validator'

interface Params {
  teamId?: string
  policyName: string
}

const withDefaults = (policy?: GetPolicyApiResponse): PolicyFormValues => ({
  ...policy,
  action: policy?.action ?? 'Audit',
  severity: policy?.severity ?? 'medium',
  customValues: policy?.customValues,
})

export default function PoliciesCreateEditPage({
  match: {
    params: { teamId = 'admin', policyName },
  },
}: RouteComponentProps<Params>) {
  const { user, oboTeamId } = useSession()
  const history = useHistory()
  const { t } = useTranslation()
  const [update, { isLoading: isUpdating }] = useEditPolicyMutation()
  const { currentData: policy, isLoading, isFetching, isError, refetch } = useGetPolicyQuery({ teamId, policyName })
  const {
    currentData: teams,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    isError: isTeamsError,
    refetch: refetchTeams,
  } = useGetAplTeamsQuery()
  const isDirty = useAppSelector(({ global }) => global.isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
    if (!isFetchingTeams) refetchTeams()
  }, [isDirty])

  const methods = useForm<PolicyFormValues>({
    resolver: yupResolver(policySchema, { strict: true }),
    defaultValues: withDefaults(),
  })
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty: hasChanges, isSubmitting },
  } = methods
  const target = `${teamId}/${policyName}`
  const currentTarget = useRef(target)
  currentTarget.current = target
  const previous = useRef<{ target: string; policy: GetPolicyApiResponse }>()
  useEffect(() => {
    if (!policy || (previous.current?.target === target && isEqual(previous.current.policy, policy))) return
    previous.current = { target, policy }
    reset(withDefaults(policy))
  }, [policy, target, reset])

  const team = teams?.find(({ metadata }) => metadata.name === teamId)
  const inScope = user.isPlatformAdmin || teamId === oboTeamId
  const canEdit =
    inScope &&
    (user.isPlatformAdmin || teamId === 'admin' || team?.spec?.selfService?.teamMembers?.editSecurityPolicies)
  const deniedAttributes = user.isPlatformAdmin ? [] : user.authz?.[teamId]?.deniedAttributes?.policy ?? []
  const isDenied = (attribute: keyof GetPolicyApiResponse) =>
    deniedAttributes.some(
      (path) =>
        path === '*' || path === attribute || path.startsWith(`${attribute}.`) || path.startsWith(`${attribute}[`),
    )
  const showCustomValues = supportsCustomValues(policyName)
  const editable =
    canEdit && (!isDenied('action') || !isDenied('severity') || (showCustomValues && !isDenied('customValues')))
  const loading = isLoading || isLoadingTeams
  const unavailable = isError || isTeamsError
  const disabled =
    !editable ||
    loading ||
    unavailable ||
    !policy ||
    !teams ||
    isFetching ||
    isFetchingTeams ||
    isUpdating ||
    isSubmitting
  const redirectTo = `/teams/${teamId}/policies`
  const title = t('FORM_TITLE_TEAM', { model: t('Policy'), name: policyName, teamId })
  const metadata = getSpec().components.schemas.Policies.properties[policyName]
  const description = metadata && typeof metadata === 'object' ? metadata.description : undefined

  const onSubmit = async (values: PolicyFormValues) => {
    if (disabled || !hasChanges) return
    const saved = withDefaults(policy)
    const body: GetPolicyApiResponse = {
      ...omit(policy, ['id', 'name']),
      action: isDenied('action') ? saved.action : values.action,
      severity: isDenied('severity') ? saved.severity : values.severity,
      ...(showCustomValues && !isDenied('customValues') && values.customValues
        ? { customValues: values.customValues.filter((value) => value !== '') }
        : {}),
    }
    const result = await update({ teamId, policyName, body })
    if (currentTarget.current !== target) return
    if ('error' in result) {
      snack.error('Unable to save policy. Please try again.')
      return
    }
    reset(withDefaults(body))
    snack.success('Policy saved successfully')
    history.push(redirectTo)
  }

  return (
    <PaperLayout
      loading={loading || (!unavailable && (!policy || !teams))}
      title={t('TITLE_POLICY', { policyName, role: 'team' })}
      comp={
        <>
          <LandingHeader
            title={title}
            docsLink='https://techdocs.akamai.com/app-platform/docs/team-security-policies'
          />
          {unavailable && <InformationBanner type='error' message='Unable to load policy data. Please try again.' />}
          {!unavailable && (
            <FormProvider {...methods}>
              <form
                noValidate
                onSubmit={(event) => {
                  if (disabled) {
                    event.preventDefault()
                    return
                  }
                  handleSubmit(onSubmit)(event)
                }}
              >
                {!editable && <InformationBanner message='This page is readonly' />}
                <Section title='Action' description={description}>
                  <Controller
                    name='action'
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <RadioGroup {...field} row aria-label='Action'>
                          <FormControlLabel
                            value='Audit'
                            control={<Radio />}
                            label='Audit'
                            disabled={disabled || isDenied('action')}
                          />
                          <FormControlLabel
                            value='Enforce'
                            control={<Radio />}
                            label='Enforce'
                            disabled={disabled || isDenied('action')}
                          />
                        </RadioGroup>
                        {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                      </>
                    )}
                  />
                </Section>
                <Section title='Severity'>
                  <Controller
                    name='severity'
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <RadioGroup {...field} row aria-label='Severity'>
                          <FormControlLabel
                            value='low'
                            control={<Radio />}
                            label='Low'
                            disabled={disabled || isDenied('severity')}
                          />
                          <FormControlLabel
                            value='medium'
                            control={<Radio />}
                            label='Medium'
                            disabled={disabled || isDenied('severity')}
                          />
                          <FormControlLabel
                            value='high'
                            control={<Radio />}
                            label='High'
                            disabled={disabled || isDenied('severity')}
                          />
                        </RadioGroup>
                        {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                      </>
                    )}
                  />
                </Section>
                {showCustomValues && (
                  <Section title='Custom values'>
                    <Controller
                      name='customValues'
                      control={control}
                      render={({ field, fieldState }) => {
                        const values = field.value ?? []
                        const fieldDisabled = disabled || isDenied('customValues')
                        return (
                          <>
                            {values.map((value, index) => (
                              // Entries are editable and may have duplicate values.
                              // eslint-disable-next-line react/no-array-index-key
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <TextField
                                  label={`Custom value ${index + 1}`}
                                  id={`custom-value-${index}`}
                                  inputId={`custom-value-${index}`}
                                  value={value}
                                  disabled={fieldDisabled}
                                  onChange={(event) =>
                                    field.onChange(values.map((item, i) => (i === index ? event.target.value : item)))
                                  }
                                  width='fullwidth'
                                  errorText={fieldState.error?.message}
                                />
                                <Button
                                  type='button'
                                  disabled={fieldDisabled}
                                  onClick={() => field.onChange(values.filter((_, i) => i !== index))}
                                >
                                  Remove custom value {index + 1}
                                </Button>
                              </Box>
                            ))}
                            {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
                            <Button
                              type='button'
                              disabled={fieldDisabled}
                              onClick={() => field.onChange([...values, ''])}
                            >
                              Add custom value
                            </Button>
                          </>
                        )
                      }}
                    />
                  </Section>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button type='button' onClick={() => history.push(redirectTo)}>
                    Cancel
                  </Button>
                  <Button type='submit' variant='contained' disabled={disabled || !hasChanges}>
                    Save Changes
                  </Button>
                </Box>
              </form>
            </FormProvider>
          )}
        </>
      }
    />
  )
}
