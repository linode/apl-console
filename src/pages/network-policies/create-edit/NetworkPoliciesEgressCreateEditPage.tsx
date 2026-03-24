// NetworkPoliciesEgressCreateEditPage.tsx
import { useEffect, useMemo } from 'react'
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
  CreateAplNetpolApiArg,
  CreateAplNetpolApiResponse,
  useCreateAplNetpolMutation,
  useDeleteAplNetpolMutation,
  useEditAplNetpolMutation,
  useGetAplNetpolQuery,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import { Divider } from 'components/Divider'
import { isEqual } from 'lodash'
import { createAplIngressSchema } from './create-edit-networkPolicies.validator'
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

  const { data, isLoading: isFetching } = useGetAplNetpolQuery(
    { teamId, netpolName: networkPolicyName },
    { skip: !networkPolicyName },
  )

  const defaultValues = useMemo(
    () =>
      createAplIngressSchema.cast({
        kind: 'AplTeamNetworkControl',
        metadata: {
          name: '',
          labels: {
            'apl.io/teamId': teamId ?? '',
          },
        },
        spec: {
          ruleType: {
            type: 'egress',
            egress: {
              domain: '',
              ports: [],
            },
          },
        },
        status: {
          conditions: [],
          phase: undefined,
        },
      }) as CreateAplNetpolApiResponse,
    [teamId],
  )

  const methods = useForm<CreateAplNetpolApiResponse>({
    resolver: yupResolver(createAplIngressSchema) as unknown as Resolver<CreateAplNetpolApiResponse>,
    defaultValues:
      data && networkPolicyName ? (createAplIngressSchema.cast(data) as CreateAplNetpolApiResponse) : defaultValues,
  })

  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (data) reset(createAplIngressSchema.cast(data) as CreateAplNetpolApiResponse)
  }, [data, reset])

  const {
    fields: portFields,
    append: appendPort,
    remove: removePort,
  } = useFieldArray({
    control,
    name: 'spec.ruleType.egress.ports',
  })

  useEffect(() => {
    if (!networkPolicyName) appendPort({ protocol: 'TCP', number: 0 })
  }, [networkPolicyName, appendPort])

  const [create, { isLoading: isCreating, isSuccess: didCreate }] = useCreateAplNetpolMutation()
  const [update, { isLoading: isUpdating, isSuccess: didUpdate }] = useEditAplNetpolMutation()
  const [del, { isLoading: isDeleting, isSuccess: didDelete }] = useDeleteAplNetpolMutation()

  const onSubmit = (formData: CreateAplNetpolApiResponse) => {
    const body: CreateAplNetpolApiArg['body'] = {
      kind: 'AplTeamNetworkControl',
      metadata: {
        name: formData.metadata?.name ?? '',
        labels: {
          'apl.io/teamId': teamId ?? '',
        },
      },
      spec: {
        ruleType: {
          type: 'egress',
          egress: {
            domain: formData.spec?.ruleType?.egress?.domain ?? '',
            ports: formData.spec?.ruleType?.egress?.ports,
          },
        },
      },
    }

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
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-network-policies#outbound-rules'
          title={networkPolicyName ? data?.metadata?.name : 'Create'}
          hideCrumbX={[0, 1, 3]}
        />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Section title='Add outbound rule'>
              <TextField
                label='Outbound rule name'
                width='large'
                value={watch('metadata.name') ?? ''}
                onChange={(e) => setValue('metadata.name', e.target.value)}
                error={!!errors.metadata?.name}
                helperText={errors.metadata?.name?.message}
                placeholder='e.g. allow-example-443'
                disabled={!!networkPolicyName}
              />

              <TextField
                label='Domain name or IP address'
                width='large'
                value={watch('spec.ruleType.egress.domain') ?? ''}
                onChange={(e) => setValue('spec.ruleType.egress.domain', e.target.value)}
                error={!!errors.spec?.ruleType?.egress?.domain}
                helperText={errors.spec?.ruleType?.egress?.domain?.message}
                placeholder='e.g. example.com'
              />

              <Divider spacingBottom={15} />

              {portFields.map((field, index) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <NetworkPolicyEgressPortRow
                    key={field.id}
                    fieldArrayName={`spec.ruleType.egress.ports.${index}`}
                    rowIndex={index}
                  />
                  {portFields.length > 1 && (
                    <IconButton
                      aria-label='remove source'
                      onClick={() => removePort(index)}
                      size='small'
                      sx={{
                        // eslint-disable-next-line no-nested-ternary
                        mt: index === 0 ? (errors?.spec?.ruleType?.egress?.ports?.root ? '28px' : '51px') : 4,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              ))}

              <Button variant='outlined' sx={{ mt: 3 }} onClick={() => appendPort({ protocol: 'TCP', number: 0 })}>
                Add Port
              </Button>

              {errors.spec?.ruleType?.egress?.ports && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {(errors.spec.ruleType.egress.ports as any).message}
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
              disabled={busy || isEqual(data, watch())}
              sx={{ float: 'right', textTransform: 'none' }}
            >
              {networkPolicyName ? 'Save Changes' : 'Create Outbound Rule'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
