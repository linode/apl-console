import { Grid, MenuItem } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import { Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
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
import KeyValue from 'components/forms/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import AdvancedSettings from 'components/AdvancedSettings'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { cloneDeep, isEmpty, isEqual } from 'lodash'
import { LoadingButton } from '@mui/lab'
import DeleteButton from 'components/DeleteButton'
import { encryptSecretItem } from 'utils/sealedSecretsUtils'
import { useSession } from 'providers/Session'
import { useTranslation } from 'react-i18next'
import { mapObjectToKeyValueArray, valueArrayToObject } from 'utils/helpers'
import { useAppSelector } from 'redux/hooks'
import InformationBanner from 'components/InformationBanner'
import { useStyles } from './create-edit-secrets.styles'
import { createSealedSecretApiResponseSchema, secretTypes } from './create-edit-secrets.validator'
import { SecretTypeFields } from './SecretTypeFields'

const isDev = process.env.NODE_ENV === 'development'

async function encryptValue(sealedSecretsPEM: string, namespace: string, value: string): Promise<string> {
  if (isDev && !sealedSecretsPEM) return value
  const encryptedText = await encryptSecretItem(sealedSecretsPEM, namespace, value)
  return encryptedText
}

function getDefaultEncryptedDataForType(type: string) {
  switch (type) {
    case 'kubernetes.io/opaque':
      return [{ key: '', value: '' }]
    case 'kubernetes.io/service-account-token':
      return [{ key: 'extra', value: '' }]
    case 'kubernetes.io/dockercfg':
      return [{ key: '.dockercfg', value: '' }]
    case 'kubernetes.io/dockerconfigjson':
      return [{ key: '.dockerconfigjson', value: '' }]
    case 'kubernetes.io/basic-auth':
      return [
        { key: 'username', value: '' },
        { key: 'password', value: '' },
      ]
    case 'kubernetes.io/ssh-auth':
      return [{ key: 'ssh-privatekey', value: '' }]
    case 'kubernetes.io/tls':
      return [
        { key: 'tls.crt', value: '' },
        { key: 'tls.key', value: '' },
      ]
    default:
      return [{ key: '', value: '' }]
  }
}

type SealedSecretFormData =
  | CreateSealedSecretApiResponse
  | {
      name: string
      namespace?: string
      immutable?: boolean
      type: string
      encryptedData: { key: string; value: string }[]
      metadata: {
        labels?: { key: string; value: string }[]
        annotations?: { key: string; value: string }[]
        finalizers?: string[]
      }
    }

interface Params {
  teamId?: string
  sealedSecretName?: string
}

export default function SecretCreateEditPage({
  match: {
    params: { teamId, sealedSecretName },
  },
}: RouteComponentProps<Params>) {
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { sealedSecretsPEM } = useSession()
  const history = useHistory()
  const location = useLocation()
  const locationState = location?.state as any
  const isCoderepository = locationState?.coderepository
  const prefilled = locationState?.prefilled || {}

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: dataCreate }] =
    useCreateSealedSecretMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditSealedSecretMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteSealedSecretMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetSealedSecretQuery(
    { teamId, sealedSecretName },
    { skip: !sealedSecretName },
  )
  const isImmutable = data?.immutable || false

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  // If we have a sealedSecretName, we are converting the data to the form format
  const formData = cloneDeep(data) as SealedSecretFormData
  if (!isEmpty(data)) {
    formData.encryptedData = mapObjectToKeyValueArray(formData?.encryptedData as Record<string, string>)
    formData.metadata.annotations = mapObjectToKeyValueArray(formData?.metadata?.annotations as Record<string, string>)
    formData.metadata.labels = mapObjectToKeyValueArray(formData?.metadata?.labels as Record<string, string>)
  }

  const mergedDefaultValues = createSealedSecretApiResponseSchema.cast(formData)
  const methods = useForm<SealedSecretFormData>({
    resolver: yupResolver(createSealedSecretApiResponseSchema) as Resolver<SealedSecretFormData>,
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
    // If we have data, we reset the form with the converted data
    if (data) reset(formData as CreateSealedSecretApiResponse)
  }, [data])

  useEffect(() => {
    if (sealedSecretName) return
    const type = watch('type')
    setValue('encryptedData', getDefaultEncryptedDataForType(type))
  }, [watch('type'), sealedSecretName])

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) {
    if (isCoderepository) {
      history.push(`/teams/${teamId}/code-repositories/create`, {
        coderepository: false,
        prefilled: { ...prefilled, secret: dataCreate.name },
      })
    } else return <Redirect to={`/teams/${teamId}/secrets`} />
  }

  const onSubmit = async () => {
    const body = cloneDeep(watch())
    body.namespace = body.namespace || `team-${teamId}`
    // Re-convert the metadata to the schema(api) format
    body.metadata = {
      ...body.metadata,
      labels: valueArrayToObject(body?.metadata?.labels as { key: string; value: string }[]),
      annotations: valueArrayToObject(body?.metadata?.annotations as { key: string; value: string }[]),
      finalizers: body?.metadata?.finalizers?.filter((item: string) => item.trim() !== ''),
    }
    // If we have a sealedSecretName, we are updating an existing secret
    // Re-convert the encryptedData to the schema(api) format
    if (sealedSecretName) {
      const originalEncryptedData: Record<string, string> = {}
      let encryptedEntries: [string, string][] = []
      if (Array.isArray(data?.encryptedData)) {
        data.encryptedData.forEach(({ key, value }: { key: string; value: string }) => {
          if (key && value) originalEncryptedData[key] = value
        })
      } else if (typeof data?.encryptedData === 'object' && data?.encryptedData !== null)
        Object.assign(originalEncryptedData, data.encryptedData)

      if (Array.isArray(body?.encryptedData)) {
        encryptedEntries = await Promise.all(
          body.encryptedData
            .filter(({ key, value }: { key: string; value: string }) => key && value)
            .map(async ({ key, value }: { key: string; value: string }) => {
              const originalValue = originalEncryptedData[key]
              // Compare the encrypted texts
              // If the original value is not set or the current value is different, encrypt it
              if (!originalValue || value !== originalValue)
                return [key, await encryptValue(sealedSecretsPEM, body.namespace, value)]

              return [key, originalValue]
            }),
        )
      }
      if (encryptedEntries.length > 0) body.encryptedData = Object.fromEntries(encryptedEntries)
      else delete body.encryptedData
      update({ teamId, sealedSecretName, body } as {
        teamId: string
        sealedSecretName: string
        body: CreateSealedSecretApiResponse
      })
    } else {
      // If we don't have a sealedSecretName, we are creating a new secret
      // Encrypt the encryptedData values using the session sealedSecretsPEM
      if (Array.isArray(body.encryptedData)) {
        const encryptedEntries = await Promise.all(
          body.encryptedData
            .filter(({ key, value }: { key: string; value: string }) => key && value)
            .map(async ({ key, value }: { key: string; value: string }) => [
              key,
              await encryptValue(sealedSecretsPEM, body.namespace, value),
            ]),
        )
        if (encryptedEntries.length > 0) body.encryptedData = Object.fromEntries(encryptedEntries)
        else delete body.encryptedData
      }
      create({ teamId, body } as { teamId: string; body: CreateSealedSecretApiResponse })
    }
  }

  const loading = isLoading || isFetching
  const error = isError
  if (loading || (sealedSecretName && !data?.name)) return <PaperLayout loading title={t('TITLE_SEALEDSECRET')} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_SEALEDSECRET', { sealedSecretName, role: 'team' })}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://apl-docs.net/docs/for-devs/console/secrets'
          title={sealedSecretName ? data.name : 'Create'}
          // hides the first two crumbs (e.g. /teams/teamName)
          hideCrumbX={[0, 1]}
        />
        {sealedSecretName && isImmutable && (
          <InformationBanner
            sx={{ my: '1rem' }}
            message='This secret is marked as immutable and therefore values cannot be changed, only deleted.'
          />
        )}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <TextField
                label='Secret name'
                width='large'
                noMarginTop
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message?.toString()}
                disabled={!!sealedSecretName}
              />
              <Divider />
              <TextField
                label='Secret type'
                select
                width='large'
                helperTextPosition='top'
                error={!!errors.type}
                helperText={
                  errors.type?.message?.toString() ||
                  'Kubernetes offers different types of secrets, please see: https://kubernetes.io/docs/concepts/configuration/secret/ for which secret type fits your use case best.'
                }
                {...register('type')}
                value={watch('type') || 'kubernetes.io/opaque'}
                disabled={!!sealedSecretName}
              >
                {secretTypes.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
              {sealedSecretName && !isImmutable && (
                <InformationBanner
                  sx={{ mt: '2rem' }}
                  message={
                    !isEqual(formData.encryptedData, watch('encryptedData'))
                      ? 'You are about to override secret values, you’re changes will go into effect once you click the "Save Changes" button.'
                      : 'You can add new values to override existing values, but be aware that applications using this token might need to be adapted.'
                  }
                />
              )}
              <SecretTypeFields
                isEncrypted={!!sealedSecretName}
                immutable={sealedSecretName && watch('immutable')}
                error={!!errors.encryptedData}
                helperText={errors.encryptedData?.message?.toString()}
              />
              <Divider sx={{ mb: 1 }} />
              <ControlledCheckbox
                sx={{ my: 2 }}
                name='immutable'
                control={control}
                label='Immutable'
                explainertext='If set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified).'
                disabled={sealedSecretName && isImmutable}
              />
            </Section>
            <AdvancedSettings>
              <Section title='Metadata'>
                <KeyValue
                  title='Labels'
                  subTitle='Labels let you categorize and select objects.  (e.g. env = production, tier = backend) '
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
                  subTitle='Not used for selection like labels, but rather to describe (e.g. createdBy, expiryTimestamp)'
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
                  subTitle='A list of “blockers” that must be removed before Kubernetes can remove the Secret. This is very important, for example if you remove a secret that holds information for a TLS certificate
you first want to revoke said certificate before removing the secret, A finalizer like "acme.myorg.com/certificate-cleanup" will make sure  to first revoke the certificate before removing the
secret'
                  name='metadata.finalizers'
                  keyLabel='key'
                  valueLabel='value'
                  onlyValue
                  hideKeyField
                  showLabel={false}
                  compressed
                  keySize='medium'
                  valueSize='large'
                  addLabel='add finalizers'
                />
              </Section>
            </AdvancedSettings>
            {sealedSecretName && (
              <DeleteButton
                onDelete={() => del({ teamId, sealedSecretName })}
                resourceName={watch('name')}
                resourceType='secret'
                data-cy='button-delete-secret'
                sx={{ float: 'right', textTransform: 'capitalize', ml: 2 }}
                loading={isLoadingDelete}
                disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate}
              />
            )}
            <LoadingButton
              type='submit'
              variant='contained'
              color='primary'
              sx={{ float: 'right', textTransform: 'none' }}
              loading={isLoadingCreate || isLoadingUpdate}
              disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete || isEqual(formData, watch())}
            >
              {sealedSecretName ? 'Save Changes' : 'Create Secret'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
