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
import { TextField } from 'components/forms/TextField'
import KeyValue from 'components/forms/KeyValue'
import { LoadingButton } from '@mui/lab'
import DeleteButton from 'components/DeleteButton'
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

  // merge default values from fetched data into the yup schema
  const mergedDefaultValues = createEgressSchema.cast(data)
  const methods = useForm<CreateNetpolApiResponse>({
    resolver: yupResolver(createEgressSchema) as Resolver<CreateNetpolApiResponse>,
    defaultValues: mergedDefaultValues,
  })

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = methods

  return (
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-network-policies'
          title={networkPolicyName ? data.name : 'Create'}
          hideCrumbX={[0, 1]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(networkPolicyName ? update : create)}>
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
              <KeyValue
                title='Ports'
                keyLabel='Protocol'
                valueLabel='Port'
                addLabel='Add port'
                name='ports'
                keySize='large'
                compressed
                valueSize='large'
                // allow only numbers in the port field
                // this will apply type="number" on the value field,
                // but our KeyValue uses `valueIsNumber` for the value.
                // Instead we treat the key as the number:
                // so protocol stays text, number field is the "key"
                // KeyValue lowercases keyLabel => `.number`
                // so `ports[index].number` will be numeric
                error={!!errors.ports}
                errorText={Array.isArray(errors.ports) ? '' : (errors.ports as any)?.message}
              />
            </Section>
            {/* ... your submit/delete buttons here ... */}
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
              {networkPolicyName ? 'Save Changes' : 'Create Outbound Rule'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
