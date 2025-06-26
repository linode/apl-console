import { Grid, MenuItem } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import {
  CreateNetpolApiResponse,
  useCreateNetpolMutation,
  useDeleteNetpolMutation,
  useEditNetpolMutation,
  useGetAllAplWorkloadsQuery,
  useGetK8SWorkloadPodLabelsQuery,
  useGetNetpolQuery,
} from 'redux/otomiApi'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { RouteComponentProps } from 'react-router-dom'
import Section from 'components/Section'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { TextField } from 'components/forms/TextField'
import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { useStyles } from './create-edit-networkPolicies.styles'
import { createIngressSchema } from './create-edit-networkPolicies.validator'

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

  const [activeWorkload, setActiveWorkload] = useState('')

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: dataCreate }] =
    useCreateNetpolMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditNetpolMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteNetpolMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetNetpolQuery(
    { teamId, netpolName: networkPolicyName },
    { skip: !networkPolicyName },
  )
  const { data: aplWorkloads, isLoading: isLoadingAplWorkloads } = useGetAllAplWorkloadsQuery()
  const {
    data: workloadPodLabels,
    isLoading: isLoadingWorkloadPodlabels,
    refetch: refetchWorkloadPodLabels,
  } = useGetK8SWorkloadPodLabelsQuery(
    {
      teamId,
      workloadName: activeWorkload,
    },
    { skip: !activeWorkload },
  )

  const mergedDefaultValues = createIngressSchema.cast(data)
  const methods = useForm<CreateNetpolApiResponse>({
    resolver: yupResolver(createIngressSchema) as Resolver<CreateNetpolApiResponse>,
    defaultValues: mergedDefaultValues,
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

  useEffect(() => {
    if (aplWorkloads) console.log('Available APL Workloads:', aplWorkloads)
  }, [aplWorkloads])

  useEffect(() => {
    if (activeWorkload) {
      console.log('activeworkload', activeWorkload)
      refetchWorkloadPodLabels()
    }
  }, [activeWorkload])

  useEffect(() => {
    if (workloadPodLabels) console.log('workloadpodlabels', workloadPodLabels)
  }, [workloadPodLabels])

  if (isLoading || isLoadingAplWorkloads) return <PaperLayout loading />

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
          <form>
            <Section title='Add inbound rule'>
              <FormRow spacing={10}>
                <TextField
                  label='Workload'
                  width='large'
                  select
                  onChange={(e) => {
                    const value = e.target.value
                    setActiveWorkload(value)
                  }}
                >
                  <MenuItem key='select-a-workload' value='' disabled classes={undefined}>
                    Select a workload
                  </MenuItem>
                  {aplWorkloads?.map((workload) => (
                    <MenuItem key={workload.metadata.name} value={workload.metadata.name} classes={undefined}>
                      {workload.metadata.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Autocomplete
                  label='Label(s)'
                  multiple
                  width='large'
                  disablePortal={false}
                  options={Object.entries(workloadPodLabels ?? {}).map(([key, value]) => `${key}: ${value}`)}
                />
              </FormRow>
            </Section>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
