import { Grid } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import {
  CreateNetpolApiResponse,
  useCreateNetpolMutation,
  useDeleteNetpolMutation,
  useEditNetpolMutation,
  useGetAllAplWorkloadsQuery,
  useGetNetpolQuery,
} from 'redux/otomiApi'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Section from 'components/Section'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider } from 'components/Divider'
import { InputLabel } from 'components/InputLabel'
import { TextField } from 'components/forms/TextField'
import { LoadingButton } from '@mui/lab'
import DeleteButton from 'components/DeleteButton'
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

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: dataCreate }] =
    useCreateNetpolMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditNetpolMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteNetpolMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetNetpolQuery(
    { teamId, netpolName: networkPolicyName },
    { skip: !networkPolicyName },
  )
  const { data: aplWorkloads, isLoading: isLoadingAplWorkloads } = useGetAllAplWorkloadsQuery()

  const mergedDefaultValues = createIngressSchema.cast(data)
  const methods = useForm<CreateNetpolApiResponse>({
    resolver: yupResolver(createIngressSchema) as Resolver<CreateNetpolApiResponse>,
    defaultValues: {
      teamId,
      ruleType: {
        type: 'ingress',
        ingress: {
          mode: 'AllowOnly',
          allow: [], // start with empty array
        },
      },
    },
  })

  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = methods

  console.log('current values', watch())

  console.log('paramparamparam', teamId, networkPolicyName)

  const onSubmit = (body: CreateNetpolApiResponse) => {
    create({ teamId, body })
  }

  if (isLoading || isLoadingAplWorkloads) return <PaperLayout loading />

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/network-policies`} />

  return (
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-network-policies'
          title={networkPolicyName ? data.name : 'Create'}
          // hides the first two crumbs (e.g. /teams/teamName)
          hideCrumbX={[0, 1]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='Add inbound rule'>
              <TextField
                label='Inbound rule name'
                width='large'
                value={watch('name')}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('name', value)
                }}
              />
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px' }}>Sources</InputLabel>
              <NetworkPolicyPodLabelRow
                aplWorkloads={aplWorkloads}
                teamId={teamId}
                fieldArrayName='ruleType.ingress.allow'
              />
              <Divider />
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '15px', marginTop: '15px' }}>Target</InputLabel>
              <NetworkPolicyTargetLabelRow aplWorkloads={aplWorkloads} teamId={teamId} prefixName='ruleType.ingress' />
            </Section>
            {networkPolicyName && (
              <DeleteButton
                onDelete={() => del({ teamId, netpolName: networkPolicyName })}
                resourceName='blue-to-green'
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
              {networkPolicyName ? 'Save Changes' : 'Create Network Policy'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
