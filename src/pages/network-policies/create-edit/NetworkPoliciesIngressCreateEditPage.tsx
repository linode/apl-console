import { Button, Grid, IconButton } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import {
  CreateNetpolApiResponse,
  EditNetpolApiResponse,
  useCreateNetpolMutation,
  useDeleteNetpolMutation,
  useEditNetpolMutation,
  useGetAllAplWorkloadNamesQuery,
  useGetNetpolQuery,
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
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InformationBanner from 'components/InformationBanner'
import { useStyles } from './create-edit-networkPolicies.styles'
import { createIngressSchema } from './create-edit-networkPolicies.validator'
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

  const methods = useForm<CreateNetpolApiResponse>({
    resolver: yupResolver(createIngressSchema) as Resolver<CreateNetpolApiResponse>,
    defaultValues: {
      teamId,
      ruleType: {
        type: 'ingress',
        ingress: {
          mode: 'AllowOnly',
          allow: [],
        },
      },
    },
  })
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods

  // FieldArray for multiple source rows
  const {
    fields: sourceFields,
    append: appendSource,
    remove: removeSource,
  } = useFieldArray({ control, name: 'ruleType.ingress.allow' })

  const [showMultiPodInformationBanner, setShowMultiPodInformationBanner] = useState<boolean>(false)

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateNetpolMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditNetpolMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteNetpolMutation()
  const { data, isLoading: isLoadingFetch } = useGetNetpolQuery(
    { teamId, netpolName: networkPolicyName },
    { skip: !networkPolicyName },
  )
  const { data: aplWorkloads, isLoading: isLoadingAplWorkloads } = useGetAllAplWorkloadNamesQuery()

  // When editing, reset form with fetched data
  useEffect(() => {
    if (data) {
      const defaultValues = createIngressSchema.cast(data)
      reset(defaultValues)
    }
  }, [data, reset])

  useEffect(() => {
    if (!networkPolicyName) appendSource({ fromNamespace: '', fromLabelName: '', fromLabelValue: '' })
  }, [])

  const toggleShowMultiPodInformationBanner = useCallback(() => {
    setShowMultiPodInformationBanner(true)
  }, [])

  const onSubmit = (body: CreateNetpolApiResponse | EditNetpolApiResponse) => {
    const rawAllow = body.ruleType.ingress.allow as any[]
    const merged = rawAllow.flat ? rawAllow.flat() : rawAllow

    const filtered = merged.filter((entry) => {
      return entry.fromLabelName !== '' || entry.fromLabelValue !== '' || entry.fromNamespace !== ''
    })

    body.ruleType.ingress.allow = filtered

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
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-network-policies'
          title={networkPolicyName ? data?.name : 'Create'}
          hideCrumbX={[0, 1, 3]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='Inbound rule'>
              <TextField
                sx={{ mt: 4 }}
                label='Inbound rule name'
                width='large'
                value={watch('name')}
                onChange={(e) => methods.setValue('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder='e.g. backend-to-database'
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
                    aplWorkloads={aplWorkloads}
                    teamId={teamId}
                    rowIndex={index}
                    fieldArrayName={`ruleType.ingress.allow.${index}`}
                    showBanner={toggleShowMultiPodInformationBanner}
                  />
                  {sourceFields.length > 1 && (
                    <IconButton
                      aria-label='remove source'
                      onClick={() => removeSource(index)}
                      size='small'
                      sx={{
                        // this is not a good solution and needs a proper fix with flexbox
                        //
                        // eslint-disable-next-line no-nested-ternary
                        mt: index === 0 ? (errors?.ruleType?.ingress?.allow?.root ? '24px' : '44px') : 4,
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

              {/* Target row needs seperate component becuase of data shape */}
              <NetworkPolicyTargetLabelRow
                aplWorkloads={aplWorkloads}
                teamId={teamId}
                prefixName='ruleType.ingress'
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
              disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete}
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
