import { Grid } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import {
  CreateNetpolApiResponse,
  useCreateNetpolMutation,
  useDeleteNetpolMutation,
  useEditNetpolMutation,
  useGetNetpolQuery,
} from 'redux/otomiApi'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { RouteComponentProps } from 'react-router-dom'
import Section from 'components/Section'
import { yupResolver } from '@hookform/resolvers/yup'
import { useStyles } from './create-edit-networkPolicies.styles'
import { createEgressSchema } from './create-edit-networkPolicies.validator'

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

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: dataCreate }] =
    useCreateNetpolMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditNetpolMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteNetpolMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetNetpolQuery(
    { teamId, netpolName: networkPolicyName },
    { skip: !networkPolicyName },
  )

  const mergedDefaultValues = createEgressSchema.cast(data)
  const methods = useForm<CreateNetpolApiResponse>({
    resolver: yupResolver(createEgressSchema) as Resolver<CreateNetpolApiResponse>,
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
            <Section>{/* <Textfield /> */}</Section>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
