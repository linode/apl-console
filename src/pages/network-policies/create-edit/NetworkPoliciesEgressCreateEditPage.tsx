import AddIcon from '@mui/icons-material/Add'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Box, Button, FormHelperText, Grid, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { isEqual } from 'lodash'
import { useEffect, useMemo } from 'react'
import { FormProvider, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import Section from 'components/Section'
import DeleteButton from 'components/DeleteButton'
import { TextField } from 'components/forms/TextField'

import {
  CreateAplNetpolApiArg,
  CreateAplNetpolApiResponse,
  useCreateAplNetpolMutation,
  useDeleteAplNetpolMutation,
  useEditAplNetpolMutation,
  useGetAplNetpolQuery,
  useGetTeamAplNetpolsQuery,
} from 'redux/otomiApi'

import { createAplEgressSchema } from './create-edit-networkPolicies.validator'
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
    {
      teamId,
      netpolName: networkPolicyName,
    },
    {
      skip: !networkPolicyName,
    },
  )

  const { data: teamNetworkPolicies, isLoading: isLoadingTeamNetworkPolicies } = useGetTeamAplNetpolsQuery(
    { teamId },
    { skip: !teamId },
  )

  const existingNames = (teamNetworkPolicies ?? [])
    .map((networkPolicy) => networkPolicy?.metadata?.name)
    .filter((name): name is string => Boolean(name))

  const defaultValues = useMemo(
    () =>
      createAplEgressSchema.cast({
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
    resolver: yupResolver(createAplEgressSchema) as unknown as Resolver<CreateAplNetpolApiResponse>,
    defaultValues:
      data && networkPolicyName ? (createAplEgressSchema.cast(data) as CreateAplNetpolApiResponse) : defaultValues,
    context: {
      existingNames,
      currentName: data?.metadata?.name,
      validateOnSubmit: !networkPolicyName,
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
    if (!data) return

    reset(createAplEgressSchema.cast(data) as CreateAplNetpolApiResponse)
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
    if (!networkPolicyName && portFields.length === 0) {
      appendPort({
        protocol: 'TCP',
        number: 0,
      })
    }
  }, [networkPolicyName, appendPort, portFields.length])

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
            ports: formData.spec?.ruleType?.egress?.ports ?? [],
          },
        },
      },
    }

    if (networkPolicyName) {
      update({
        teamId,
        netpolName: networkPolicyName,
        body,
      })
    } else {
      create({
        teamId,
        body,
      })
    }
  }

  const loading = isFetching || isLoadingTeamNetworkPolicies

  if (loading) return <PaperLayout loading title={t('TITLE_NETWORK_POLICY')} />

  const busy = isCreating || isUpdating || isDeleting

  if (!busy && (didCreate || didUpdate || didDelete)) return <Redirect to={`/teams/${teamId}/network-policies`} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading} title={t('TITLE_NETWORK_POLICY')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-network-policies#outbound-rules'
          title={networkPolicyName ? data?.metadata?.name : 'Create'}
          hideCrumbX={[0, 1, 3]}
        />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Section title='General' description='Configure the name of this outbound network rule.'>
              <TextField
                label='Outbound rule name'
                width='large'
                value={watch('metadata.name') ?? ''}
                onChange={(e) =>
                  setValue('metadata.name', e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={!!errors.metadata?.name}
                helperText={errors.metadata?.name?.message}
                placeholder='e.g. allow-example-443'
                disabled={!!networkPolicyName}
              />
            </Section>

            <Section
              title='Destination'
              description='Define the domain name or IP address that workloads are allowed to connect to.'
            >
              <TextField
                label='Domain name or IP address'
                width='large'
                value={watch('spec.ruleType.egress.domain') ?? ''}
                onChange={(e) =>
                  setValue('spec.ruleType.egress.domain', e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={!!errors.spec?.ruleType?.egress?.domain}
                helperText={errors.spec?.ruleType?.egress?.domain?.message}
                placeholder='e.g. example.com'
              />
            </Section>

            <Section
              title='Ports'
              description='Specify the protocols and destination ports that outbound traffic may use.'
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {portFields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 1,
                    }}
                  >
                    <NetworkPolicyEgressPortRow
                      fieldArrayName={`spec.ruleType.egress.ports.${index}`}
                      rowIndex={index}
                    />

                    {portFields.length > 1 && (
                      <IconButton
                        aria-label='Remove port'
                        onClick={() => removePort(index)}
                        size='small'
                        sx={{
                          mb: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>

              <Button
                type='button'
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={() =>
                  appendPort({
                    protocol: 'TCP',
                    number: 0,
                  })
                }
                sx={{
                  mt: 2,
                  textTransform: 'none',
                }}
              >
                Add Port
              </Button>

              {errors.spec?.ruleType?.egress?.ports && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {(errors.spec.ruleType.egress.ports as any).message}
                </FormHelperText>
              )}
            </Section>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              {networkPolicyName && (
                <DeleteButton
                  onDelete={() =>
                    del({
                      teamId,
                      netpolName: networkPolicyName,
                    })
                  }
                  resourceName={networkPolicyName}
                  resourceType='netpol'
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
                sx={{
                  textTransform: 'none',
                }}
              >
                {networkPolicyName ? 'Save Changes' : 'Create Outbound Rule'}
              </LoadingButton>
            </Box>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
