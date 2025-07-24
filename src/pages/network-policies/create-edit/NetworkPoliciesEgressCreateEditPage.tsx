// NetworkPoliciesEgressCreateEditPage.tsx
import { useEffect } from 'react'
import { Button, FormHelperText, Grid, IconButton } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import Section from 'components/Section'
import { LoadingButton } from '@mui/lab'
import DeleteButton from 'components/DeleteButton'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { FormProvider, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextField } from 'components/forms/TextField'
import {
  CreateNetpolApiResponse,
  EditNetpolApiResponse,
  useCreateNetpolMutation,
  useDeleteNetpolMutation,
  useEditNetpolMutation,
  useGetNetpolQuery,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import { Divider } from 'components/Divider'
import { createEgressSchema } from './create-edit-networkPolicies.validator'
import { useStyles } from './create-edit-networkPolicies.styles'
import NetworkPolicyEgressPortRow from './NetworkPolicyEgressPortRow'

interface Params {
  teamId?: string
  networkPolicyName?: string
}

export default function NetworkPoliciesEgressCreateEditPage({
  match: {
    params: { teamId, networkPolicyName },
  },
}: RouteComponentProps<Params>) {
  const { classes } = useStyles()
  const { t } = useTranslation()

  const { data, isLoading: isFetching } = useGetNetpolQuery(
    { teamId, netpolName: networkPolicyName },
    { skip: !networkPolicyName },
  )

  const methods = useForm<CreateNetpolApiResponse>({
    resolver: yupResolver(createEgressSchema) as Resolver<CreateNetpolApiResponse>,
    defaultValues:
      data && networkPolicyName
        ? createEgressSchema.cast(data)
        : {
            name: '',
            ruleType: { type: 'egress', egress: { domain: '', ports: [] } },
          },
  })

  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (data) reset(createEgressSchema.cast(data))
  }, [data, reset])

  const {
    fields: portFields,
    append: appendPort,
    remove: removePort,
  } = useFieldArray({ control, name: 'ruleType.egress.ports' })

  // on create, give the user one blank row
  useEffect(() => {
    if (!networkPolicyName) appendPort({ protocol: 'TCP', number: 0 })
  }, [networkPolicyName, appendPort])

  const [create, { isLoading: isCreating, isSuccess: didCreate }] = useCreateNetpolMutation()
  const [update, { isLoading: isUpdating, isSuccess: didUpdate }] = useEditNetpolMutation()
  const [del, { isLoading: isDeleting, isSuccess: didDelete }] = useDeleteNetpolMutation()

  const onSubmit = (body: CreateNetpolApiResponse | EditNetpolApiResponse) => {
    if (networkPolicyName) update({ teamId, netpolName: networkPolicyName, body })
    else create({ teamId, body })
  }

  if (isFetching) return <PaperLayout loading />

  const busy = isCreating || isUpdating || isDeleting
  if (!busy && (didCreate || didUpdate || didDelete)) return <Redirect to={`/teams/${teamId}/network-policies`} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={isFetching} title={t('TITLE_NETWORK_POLICY')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-network-policies'
          title={networkPolicyName ? data.name : 'Create'}
          hideCrumbX={[0, 1, 3]}
        />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Section title='Add outbound rule'>
              <TextField
                label='Outbound rule name'
                width='large'
                value={watch('name')}
                onChange={(e) => setValue('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                label='Domain name or IP address'
                width='large'
                value={watch('ruleType.egress.domain')}
                onChange={(e) => setValue('ruleType.egress.domain', e.target.value)}
                error={!!errors.ruleType?.egress?.domain}
                helperText={errors.ruleType?.egress?.domain?.message}
              />

              <Divider />

              {portFields.map((field, idx) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <NetworkPolicyEgressPortRow
                    key={field.id}
                    fieldArrayName={`ruleType.egress.ports.${idx}`}
                    rowIndex={idx}
                  />
                  <IconButton aria-label='remove source' onClick={() => removePort(idx)} size='small' sx={{ mt: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}

              <Button variant='outlined' sx={{ mt: 2 }} onClick={() => appendPort({ protocol: 'TCP', number: 0 })}>
                Add Port
              </Button>

              {errors.ruleType?.egress?.ports && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {(errors.ruleType.egress.ports as any).message}
                </FormHelperText>
              )}
            </Section>

            {networkPolicyName && (
              <DeleteButton
                onDelete={() => del({ teamId, netpolName: networkPolicyName })}
                resourceName={networkPolicyName}
                resourceType='netpol'
                sx={{ float: 'right', ml: 2 }}
                loading={isDeleting}
                disabled={busy}
              />
            )}

            <LoadingButton
              type='submit'
              variant='contained'
              color='primary'
              loading={isCreating || isUpdating}
              disabled={busy}
              sx={{ float: 'right' }}
            >
              {networkPolicyName ? 'Save Changes' : 'Create Outbound Rule'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
