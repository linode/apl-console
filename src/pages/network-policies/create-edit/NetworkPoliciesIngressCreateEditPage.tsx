import { Button, Grid, IconButton } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import {
  CreateAplNetpolApiArg,
  CreateAplNetpolApiResponse,
  useCreateAplNetpolMutation,
  useDeleteAplNetpolMutation,
  useEditAplNetpolMutation,
  useGetAllWorkloadNamesQuery,
  useGetAplNetpolQuery,
} from 'redux/otomiApi'
import { FormProvider, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Section from 'components/Section'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider } from 'components/Divider'
import { InputLabel } from 'components/InputLabel'
import { TextField } from 'components/forms/TextField'
import { LoadingButton } from '@mui/lab'
import DeleteButton from 'components/DeleteButton'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InformationBanner from 'components/InformationBanner'
import { isEqual } from 'lodash'
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

  const methods = useForm<CreateAplNetpolApiResponse>({
    resolver: yupResolver(createAplIngressSchema) as unknown as Resolver<CreateAplNetpolApiResponse>,
    defaultValues,
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

  const [showMultiPodInformationBanner, setShowMultiPodInformationBanner] = useState(false)

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplNetpolMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplNetpolMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplNetpolMutation()

  const { data, isLoading: isLoadingFetch } = useGetAplNetpolQuery(
    { teamId, netpolName: networkPolicyName },
    { skip: !networkPolicyName },
  )

  const { data: aplWorkloads, isLoading: isLoadingAplWorkloads } = useGetAllWorkloadNamesQuery()

  useEffect(() => {
    if (!data) return
    reset(createAplIngressSchema.cast(data) as CreateAplNetpolApiResponse)
  }, [data, reset])

  useEffect(() => {
    if (!networkPolicyName) appendSource({ fromNamespace: '', fromLabelName: '', fromLabelValue: '' })
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

    if (networkPolicyName) update({ teamId, netpolName: networkPolicyName, body })
    else create({ teamId, body })
  }

  if (isLoadingFetch || isLoadingAplWorkloads) return <PaperLayout loading />

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
            <Section title='Inbound rule'>
              <TextField
                sx={{ mt: 4 }}
                label='Inbound rule name'
                width='large'
                value={watch('metadata.name') ?? ''}
                onChange={(e) => setValue('metadata.name', e.target.value)}
                error={!!errors.metadata?.name}
                helperText={errors.metadata?.name?.message}
                placeholder='e.g. backend-to-database'
                disabled={!!networkPolicyName}
              />

              <InputLabel sx={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px' }}>Sources</InputLabel>

              {showMultiPodInformationBanner && (
                <InformationBanner
                  sx={{ mt: 2 }}
                  small
                  message='Some labels match with multiple pods and therefore cannot be pinpointed to one specific workload, this does not affect functionality'
                />
              )}

              {sourceFields.map((field, index) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <NetworkPolicyPodLabelRow
                    aplWorkloads={aplWorkloads || []}
                    teamId={teamId}
                    rowIndex={index}
                    fieldArrayName={`spec.ruleType.ingress.allow.${index}`}
                    showBanner={toggleShowMultiPodInformationBanner}
                  />
                  {sourceFields.length > 1 && (
                    <IconButton
                      aria-label='remove source'
                      onClick={() => removeSource(index)}
                      size='small'
                      sx={{
                        // eslint-disable-next-line no-nested-ternary
                        mt: index === 0 ? (errors?.spec?.ruleType?.ingress?.allow?.root ? '24px' : '44px') : 4,
                        alignSelf: 'center',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              ))}

              <Button
                sx={{ mt: 3 }}
                variant='outlined'
                onClick={() => appendSource({ fromNamespace: '', fromLabelName: '', fromLabelValue: '' })}
              >
                Add Source
              </Button>

              <Divider sx={{ marginY: 4 }} />

              <InputLabel sx={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px' }}>Target</InputLabel>

              <NetworkPolicyTargetLabelRow
                aplWorkloads={aplWorkloads || []}
                teamId={teamId}
                prefixName='spec.ruleType.ingress'
                showBanner={toggleShowMultiPodInformationBanner}
                isEditMode={!!networkPolicyName}
              />
            </Section>

            {networkPolicyName && (
              <DeleteButton
                onDelete={() => del({ teamId, netpolName: networkPolicyName })}
                resourceName={networkPolicyName}
                resourceType='netpol'
                data-cy='button-delete-netpol'
                sx={{ float: 'right', textTransform: 'capitalize', ml: 2 }}
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
              sx={{ float: 'right', textTransform: 'none' }}
            >
              {networkPolicyName ? 'Save Changes' : 'Create Inbound Rule'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
