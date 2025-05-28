import { Grid, MenuItem } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import useSettings from 'hooks/useSettings'
import { LandingHeader } from 'components/LandingHeader'
import { RouteComponentProps } from 'react-router-dom'
import {
  CreateSealedSecretApiResponse,
  useCreateSealedSecretMutation,
  useDeleteSealedSecretMutation,
  useEditSealedSecretMutation,
  useGetSealedSecretQuery,
} from 'redux/otomiApi'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { TextField } from 'components/forms/TextField'
import Section from 'components/Section'
import { Divider } from 'components/Divider'
import KeyValue from 'components/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import AdvancedSettings from 'components/AdvancedSettings'
import { yupResolver } from '@hookform/resolvers/yup'
import { useStyles } from './create-edit-secrets.styles'
import { createSealedSecretApiResponseSchema, secretTypes } from './create-edit-secrets.validator'
import { SecretTypeFields } from './SecretTypeFields'

interface Params {
  teamId?: string
  sealedSecretName?: string
}

export default function SecretCreateEditPage({
  match: {
    params: { teamId, sealedSecretName },
  },
}: RouteComponentProps<Params>) {
  const { classes } = useStyles()
  const { themeView } = useSettings()

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: dataCreate }] =
    useCreateSealedSecretMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditSealedSecretMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteSealedSecretMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetSealedSecretQuery(
    { teamId, sealedSecretName },
    { skip: !sealedSecretName },
  )

  const mergedDefaultValues = createSealedSecretApiResponseSchema.cast(data)

  const methods = useForm<CreateSealedSecretApiResponse>({
    resolver: yupResolver(createSealedSecretApiResponseSchema) as Resolver<CreateSealedSecretApiResponse>,
    defaultValues: mergedDefaultValues,
  })

  const {
    control,
    register,
    reset,
    resetField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = methods

  console.log('watch data', watch())

  const onSubmit = () => {
    console.log('secret on submit submit')
  }

  return (
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://apl-docs.net/docs/for-devs/console/secrets'
          title={sealedSecretName ? data.name : 'Create'}
          // hides the first two crumbs (e.g. /teams/teamName)
          hideCrumbX={[0, 1]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <TextField label='Secret name' width='large' noMarginTop />
              <Divider />
              <TextField
                label='Secret type'
                select
                width='large'
                helperTextPosition='top'
                helperText='Kubernetes offers different types of secrets, please see: https://kubernetes.io/docs/concepts/configuration/secret/ for which secret type fits your use case best. '
                {...register('type')}
              >
                {/** default will be basic auth */}
                {/* <MenuItem key='select-a-secret'>Select a secret type</MenuItem> */}
                {secretTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              {/* <KeyValue
                title='Encrypted Data'
                name='encryptedData'
                keyLabel='key'
                valueLabel='value'
                addLabel='add data'
                showLabel={false}
                compressed
                keySize='medium'
                valueSize='medium'
                isTextArea
                {...register('encryptedData')}
              /> */}
              <SecretTypeFields />
              <Divider />
              <ControlledCheckbox
                sx={{ my: 2 }}
                name='checkbox'
                control={control}
                label='Immutable'
                explainertext='If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).'
              />
            </Section>
            <AdvancedSettings>
              <Section title='Metadata'>
                <KeyValue
                  title='Labels'
                  helperText='Labels let you categorize and select objects.  (e.g. env = production, tier = backend) '
                  name='metadata.labels'
                  keyLabel='key'
                  valueLabel='value'
                  showLabel={false}
                  compressed
                  keySize='medium'
                  valueSize='medium'
                  addLabel='add labels'
                />
                <Divider />
                <KeyValue
                  title='Annotations'
                  helperText='Not used for selection like labels, but rather to describe (e.g. createdBy, expiryTimestamp)'
                  name='metadata.annotations'
                  keyLabel='key'
                  valueLabel='value'
                  showLabel={false}
                  compressed
                  keySize='medium'
                  valueSize='medium'
                  addLabel='add annotations'
                />
                <Divider />
                <KeyValue
                  title='Finalizers'
                  helperText='A list of “blockers” that must be removed before Kubernetes can remove the Secret. This is very important, for example if you remove a secret that holds information for a TLS certificate
you first want to revoke said certificate before removing the secret, A finalizer like "acme.myorg.com/certificate-cleanup" will make sure  to first revoke the certificate before removing the
secret'
                  name='metadata.finalizers'
                  keyLabel='key'
                  valueLabel='value'
                  onlyValue
                  showLabel={false}
                  compressed
                  keySize='medium'
                  valueSize='medium'
                  addLabel='add finalizers'
                />
              </Section>
            </AdvancedSettings>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
