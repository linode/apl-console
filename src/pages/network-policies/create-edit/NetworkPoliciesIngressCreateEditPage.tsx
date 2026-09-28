import AddIcon from '@mui/icons-material/Add'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Box, Button, Grid, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { isEqual } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import Section from 'components/Section'
import { TextField } from 'components/forms/TextField'
import DeleteButton from 'components/DeleteButton'
import InformationBanner from 'components/InformationBanner'

import {
  CreateAplNetpolApiArg,
  CreateAplNetpolApiResponse,
  useCreateAplNetpolMutation,
  useDeleteAplNetpolMutation,
  useEditAplNetpolMutation,
  useGetAllWorkloadNamesQuery,
  useGetAplNetpolQuery,
  useGetTeamAplNetpolsQuery,
} from 'redux/otomiApi'

import { useStyles } from './create-edit-networkPolicies.styles'
import { createAplIngressSchema } from './create-edit-networkPolicies.validator'
import NetworkPolicyPodLabelRow from './NetworkPolicyPodLabelRow'
import NetworkPolicyTargetLabelRow from './NetworkPolicyTargetPodLabelRow'

interface Params {
  teamId?: string
  networkPolicyName?: string
}

export default function NetworkPoliciesIngressCreateEditPage({
  match: {
    params: { teamId, networkPolicyName },
  },
}: RouteComponentProps<Params>) {
  const { classes } = useStyles()
  const { t } = useTranslation()

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
            type: 'ingress',
            ingress: {
              mode: 'AllowOnly',
              allow: [],
              toLabelName: '',
              toLabelValue: '',
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

  const [showMultiPodInformationBanner, setShowMultiPodInformationBanner] = useState(false)

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplNetpolMutation()

  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplNetpolMutation()

  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplNetpolMutation()

  const { data, isLoading: isLoadingFetch } = useGetAplNetpolQuery(
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

  const { data: aplWorkloads, isLoading: isLoadingAplWorkloads } = useGetAllWorkloadNamesQuery()

  const existingNames = (teamNetworkPolicies ?? [])
    .map((networkPolicy) => networkPolicy?.metadata?.name)
    .filter((name): name is string => Boolean(name))

  const methods = useForm<CreateAplNetpolApiResponse>({
    resolver: yupResolver(createAplIngressSchema) as unknown as Resolver<CreateAplNetpolApiResponse>,
    defaultValues,
    context: {
      existingNames,
      currentName: data?.metadata?.name,
      validateOnSubmit: !networkPolicyName,
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = methods

  const {
    fields: sourceFields,
    append: appendSource,
    remove: removeSource,
  } = useFieldArray({
    control,
    name: 'spec.ruleType.ingress.allow',
  })

  useEffect(() => {
    if (!data) return

    reset(createAplIngressSchema.cast(data) as CreateAplNetpolApiResponse)
  }, [data, reset])

  useEffect(() => {
    if (!networkPolicyName) {
      appendSource({
        fromNamespace: '',
        fromLabelName: '',
        fromLabelValue: '',
      })
    }
  }, [networkPolicyName, appendSource])

  const toggleShowMultiPodInformationBanner = useCallback(() => {
    setShowMultiPodInformationBanner(true)
  }, [])

  const onSubmit = (formData: CreateAplNetpolApiResponse) => {
    const rawAllow = formData.spec?.ruleType?.ingress?.allow ?? []
    const merged = (rawAllow as any[]).flat ? (rawAllow as any[]).flat() : rawAllow

    const filtered = merged.filter((entry) => {
      return entry.fromLabelName !== '' || entry.fromLabelValue !== '' || entry.fromNamespace !== ''
    })

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
          type: 'ingress',
          ingress: {
            toLabelName: formData.spec?.ruleType?.ingress?.toLabelName,
            toLabelValue: formData.spec?.ruleType?.ingress?.toLabelValue,
            mode: formData.spec?.ruleType?.ingress?.mode ?? 'AllowOnly',
            allow: filtered,
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

  if (isLoadingFetch || isLoadingAplWorkloads || isLoadingTeamNetworkPolicies)
    return <PaperLayout loading title={t('TITLE_NETWORK_POLICY')} />

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete

  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/network-policies`} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={isLoadingFetch} title={t('TITLE_NETWORK_POLICY')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-network-policies#inbound-rules'
          title={networkPolicyName ? data?.metadata?.name : 'Create'}
          hideCrumbX={[0, 1, 3]}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='General' description='Configure the name of this inbound network rule.'>
              <TextField
                label='Inbound rule name'
                width='large'
                value={watch('metadata.name') ?? ''}
                onChange={(e) => setValue('metadata.name', e.target.value)}
                error={!!errors.metadata?.name}
                helperText={errors.metadata?.name?.message}
                placeholder='e.g. backend-to-database'
                disabled={!!networkPolicyName}
              />
            </Section>

            <Section
              title='Sources'
              description='Define the namespaces and workloads that are allowed to send traffic to the target.'
            >
              {showMultiPodInformationBanner && (
                <InformationBanner
                  sx={{ mb: 2 }}
                  small
                  message='Some labels match multiple pods and therefore cannot be pinpointed to one specific workload. This does not affect functionality.'
                />
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {sourceFields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 1,
                    }}
                  >
                    <NetworkPolicyPodLabelRow
                      aplWorkloads={aplWorkloads || []}
                      teamId={teamId}
                      rowIndex={index}
                      fieldArrayName={`spec.ruleType.ingress.allow.${index}`}
                      showBanner={toggleShowMultiPodInformationBanner}
                    />

                    {sourceFields.length > 1 && (
                      <IconButton
                        aria-label='Remove source'
                        onClick={() => removeSource(index)}
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
                sx={{
                  mt: 2,
                  textTransform: 'none',
                }}
                type='button'
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={() =>
                  appendSource({
                    fromNamespace: '',
                    fromLabelName: '',
                    fromLabelValue: '',
                  })
                }
              >
                Add Source
              </Button>
            </Section>

            <Section title='Target' description='Select the workload that incoming traffic is allowed to reach.'>
              <NetworkPolicyTargetLabelRow
                aplWorkloads={aplWorkloads || []}
                teamId={teamId}
                prefixName='spec.ruleType.ingress'
                showBanner={toggleShowMultiPodInformationBanner}
                isEditMode={!!networkPolicyName}
              />
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
                  data-cy='button-delete-netpol'
                  loading={isLoadingDelete}
                  disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate}
                />
              )}

              <LoadingButton
                type='submit'
                variant='contained'
                color='primary'
                loading={isLoadingCreate || isLoadingUpdate}
                disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete || isEqual(data, watch())}
                sx={{
                  textTransform: 'none',
                }}
              >
                {networkPolicyName ? 'Save Changes' : 'Create Inbound Rule'}
              </LoadingButton>
            </Box>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
