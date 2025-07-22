import { Button, Grid, IconButton } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import {
  CreateNetpolApiResponse,
  EditNetpolApiResponse,
  useCreateNetpolMutation,
  useDeleteNetpolMutation,
  useEditNetpolMutation,
  useGetAllAplWorkloadsQuery,
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
import { useEffect, useState } from 'react'
import { useStyles } from './create-edit-networkPolicies.styles'
import { createIngressSchema } from './create-edit-networkPolicies.validator'
import NetworkPolicyPodLabelRow from './NetworkPolicyPodLabelRow'
import NetworkPolicyTargetLabelRow from './NetworkPolicyTargetPodLabelRow'
import NetworkPoliciesFlowRenderer from './NetworkPoliciesFlowRenderer'

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

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateNetpolMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditNetpolMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteNetpolMutation()
  const {
    data,
    isLoading: isLoadingFetch,
    refetch,
  } = useGetNetpolQuery({ teamId, netpolName: networkPolicyName }, { skip: !networkPolicyName })
  const { data: aplWorkloads, isLoading: isLoadingAplWorkloads } = useGetAllAplWorkloadsQuery()

  const [sourcesByNs, setSourcesByNs] = useState<Record<string, string[]>>({})
  const [targetsByNs, setTargetsByNs] = useState<Record<string, string[]>>({})

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

  const onSubmit = (body: CreateNetpolApiResponse | EditNetpolApiResponse) => {
    const rawAllow = body.ruleType.ingress.allow as any[]
    const merged = rawAllow.flat ? rawAllow.flat() : rawAllow
    body.ruleType.ingress.allow = merged

    if (networkPolicyName) update({ teamId, netpolName: networkPolicyName, body })
    else create({ teamId, body })
  }

  if (isLoadingFetch || isLoadingAplWorkloads) return <PaperLayout loading />

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/network-policies`} />

  return (
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-network-policies'
          title={networkPolicyName ? data?.name : 'Create'}
          hideCrumbX={[0, 1, 3]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='Add inbound rule'>
              <TextField
                label='Inbound rule name'
                width='large'
                value={watch('name')}
                onChange={(e) => methods.setValue('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder='e.g. backend-to-database'
              />

              <InputLabel sx={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px' }}>Sources</InputLabel>

              {sourceFields.map((field, index) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  <NetworkPolicyPodLabelRow
                    aplWorkloads={aplWorkloads}
                    teamId={teamId}
                    rowIndex={index}
                    fieldArrayName={`ruleType.ingress.allow.${index}`}
                    rowType='source'
                    onPodNamesChange={(ns, podNames, role) => {
                      setSourcesByNs((prev) => ({ ...prev, [ns]: podNames }))
                    }}
                  />
                  {index !== 0 && (
                    <IconButton
                      aria-label='remove source'
                      onClick={() => removeSource(index)}
                      size='small'
                      sx={{ mt: 1 }}
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
                onPodNamesChange={(ns, podNames) => {
                  setTargetsByNs((prev) => ({ ...prev, [ns]: podNames }))
                }}
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
        <NetworkPoliciesFlowRenderer sourcesByNamespace={sourcesByNs} targetsByNamespace={targetsByNs} />
      </PaperLayout>
    </Grid>
  )
}
