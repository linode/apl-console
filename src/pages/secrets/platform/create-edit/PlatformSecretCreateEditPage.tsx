import { Grid, MenuItem } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  CreateAplSealedSecretApiArg,
  useCreateAplNamespaceSealedSecretMutation,
  useDeleteAplNamespaceSealedSecretMutation,
  useEditAplNamespaceSealedSecretMutation,
  useGetAplNamespaceSealedSecretQuery,
} from 'redux/otomiApi'
import { FormProvider, useForm } from 'react-hook-form'
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
import { encryptSecretItem } from '@linode/kubeseal-encrypt'
import { useSession } from 'providers/Session'
import { useTranslation } from 'react-i18next'
import { mapObjectToKeyValueArray, valueArrayToObject } from 'utils/helpers'
import { useAppSelector } from 'redux/hooks'
import InformationBanner from 'components/InformationBanner'
import * as yup from 'yup'
import FormRow from 'components/forms/FormRow'
import { useStyles } from './create-edit-platform-secrets.styles'
import { createSealedSecretApiResponseSchema, secretTypes } from './create-edit-platform-secrets.validator'
import { SecretTypeFields } from './PlatformSecretTypeFields'

const isDev = process.env.NODE_ENV === 'development'

type SealedSecretFormData = yup.InferType<typeof createSealedSecretApiResponseSchema>

async function encryptValue(sealedSecretsPEM: string, namespace: string, value: string): Promise<string> {
  if (isDev && !sealedSecretsPEM) return value
  const encryptedText = await encryptSecretItem(sealedSecretsPEM, namespace, value)
  return encryptedText
}

function getDefaultEncryptedDataForType(type: string) {
  switch (type) {
    case 'kubernetes.io/opaque':
      return [{ key: '', value: '' }]
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

interface Params {
  namespace?: string
  sealedSecretName?: string
}

export default function SecretCreateEditPage({
  match: {
    params: { namespace, sealedSecretName },
  },
}: RouteComponentProps<Params>) {
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { sealedSecretsPEM } = useSession()

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] =
    useCreateAplNamespaceSealedSecretMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplNamespaceSealedSecretMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplNamespaceSealedSecretMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetAplNamespaceSealedSecretQuery(
    { namespace, sealedSecretName },
    { skip: !sealedSecretName },
  )
  const isImmutable = data?.spec?.template?.immutable || false

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  // Convert API v2 response to form data format
  const formData = cloneDeep(data) as any
  if (!isEmpty(data)) {
    // Convert spec.encryptedData object to array format for the form
    formData.spec.encryptedData = mapObjectToKeyValueArray(data?.spec?.encryptedData as Record<string, string>)

    // Convert spec.template.metadata objects to array format for the form
    if (formData.spec?.template?.metadata) {
      formData.spec.template.metadata.annotations = mapObjectToKeyValueArray(
        data?.spec?.template?.metadata?.annotations as Record<string, string>,
      )
      formData.spec.template.metadata.labels = mapObjectToKeyValueArray(
        data?.spec?.template?.metadata?.labels as Record<string, string>,
      )
    }
  }

  const mergedDefaultValues = createSealedSecretApiResponseSchema.cast(formData)
  const methods = useForm<SealedSecretFormData>({
    resolver: yupResolver(createSealedSecretApiResponseSchema),
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
    if (data) reset(formData as SealedSecretFormData)
  }, [data])

  useEffect(() => {
    if (sealedSecretName) return
    const type = watch('spec.template.type')
    setValue('spec.encryptedData', getDefaultEncryptedDataForType(type))
  }, [watch('spec.template.type'), sealedSecretName])

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) return <Redirect to='/secrets' />

  const onSubmit = async () => {
    const formValues = cloneDeep(watch())
    const namespace = formValues.metadata.namespace

    const body: CreateAplSealedSecretApiArg['body'] = {
      kind: 'SealedSecret',
      apiVersion: 'bitnami.com/v1alpha1',
      metadata: {
        name: formValues.metadata.name,
        namespace,
      },
      spec: {
        encryptedData: {},
        template: {
          type: formValues.spec.template.type as any,
          immutable: formValues.spec.template.immutable,
          metadata: {
            name: formValues.metadata.name,
            namespace,
            annotations: valueArrayToObject(
              formValues.spec?.template?.metadata?.annotations as { key: string; value: string }[],
            ),
            labels: valueArrayToObject(formValues.spec?.template?.metadata?.labels as { key: string; value: string }[]),
            finalizers: formValues.spec?.template?.metadata?.finalizers?.filter((item: string) => item.trim() !== ''),
          },
        },
      },
    }

    if (sealedSecretName) {
      // Editing: compare with original to avoid re-encrypting unchanged values
      const originalEncryptedData: Record<string, string> = data?.spec?.encryptedData || {}

      if (Array.isArray(formValues.spec.encryptedData)) {
        const encryptedEntries = await Promise.all(
          formValues.spec.encryptedData
            .filter(({ key, value }: { key: string; value: string }) => key && value)
            .map(async ({ key, value }: { key: string; value: string }) => {
              const originalValue = originalEncryptedData[key]
              // Compare the encrypted texts
              // If the original value is not set or the current value is different, encrypt it
              if (!originalValue || value !== originalValue)
                return [key, await encryptValue(sealedSecretsPEM, namespace, value)]

              return [key, originalValue]
            }),
        )
        if (encryptedEntries.length > 0) body.spec.encryptedData = Object.fromEntries(encryptedEntries)
      }
      update({ namespace, sealedSecretName, body })
    } else {
      // If we don't have a sealedSecretName, we are creating a new secret
      // Encrypt the encryptedData values using the session sealedSecretsPEM
      if (Array.isArray(formValues.spec.encryptedData)) {
        const encryptedEntries = await Promise.all(
          formValues.spec.encryptedData
            .filter(({ key, value }: { key: string; value: string }) => key && value)
            .map(async ({ key, value }: { key: string; value: string }) => [
              key,
              await encryptValue(sealedSecretsPEM, namespace, value),
            ]),
        )
        if (encryptedEntries.length > 0) body.spec.encryptedData = Object.fromEntries(encryptedEntries)
      }
      create({ namespace, body })
    }
  }

  const loading = isLoading || isFetching
  const error = isError
  if (loading || (sealedSecretName && !data?.metadata?.name)) return <PaperLayout loading title={t('TITLE_SECRETS')} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_SECRETS', { sealedSecretName, role: 'team' })}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-secrets'
          title={sealedSecretName ? data.metadata.name : 'Create'}
          // hides the first two crumbs (e.g. /teams/teamName)
          hideCrumbX={[1]}
        />
        {sealedSecretName && isImmutable && (
          <InformationBanner
            sx={{ my: '1rem' }}
            message='This secret is marked as immutable and therefore the Secret data cannot be modified, only deleted.'
          />
        )}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <FormRow spacing={10} sx={{ flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap' }}>
                <TextField
                  label='Secret name'
                  width='large'
                  noMarginTop
                  {...register('metadata.name')}
                  error={!!errors.metadata?.name}
                  helperText={errors.metadata?.name?.message?.toString()}
                  disabled={!!sealedSecretName}
                  sx={{ mb: 1 }}
                />
                <TextField
                  label='Namespace'
                  width='large'
                  noMarginTop
                  {...register('metadata.namespace')}
                  error={!!errors.metadata?.namespace}
                  helperText={errors.metadata?.namespace?.message?.toString()}
                  disabled={!!sealedSecretName}
                  sx={{ mb: 1 }}
                />
              </FormRow>

              <Divider spacingTop={25} />
              <TextField
                label='Secret type'
                select
                width='large'
                helperTextPosition='top'
                error={!!errors.spec?.template?.type}
                helperText={
                  (errors.spec?.template?.type as any)?.message?.toString() ||
                  'Select the Secret type for the appropriate handling of the Secret data.'
                }
                {...register('spec.template.type')}
                value={watch('spec.template.type') || 'kubernetes.io/opaque'}
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
                    !isEqual(formData?.spec?.encryptedData, watch('spec.encryptedData'))
                      ? 'You are about to change secret data. Changes will become active after clicking the "Save Changes" button.'
                      : 'You can add new or override existing secret data.'
                  }
                />
              )}
              <SecretTypeFields
                namePrefix='spec'
                isEncrypted={!!sealedSecretName}
                immutable={sealedSecretName && watch('spec.template.immutable')}
                error={!!errors.spec?.encryptedData}
                helperText={
                  errors.spec?.encryptedData?.message?.toString() ||
                  errors.spec?.encryptedData?.root?.message?.toString()
                }
              />
              <Divider sx={{ mb: 1 }} />
              <ControlledCheckbox
                sx={{ my: 2 }}
                name='spec.template.immutable'
                control={control}
                label='Immutable'
                explainertext='If enabled, the Secret data cannot be updated after creation.'
                disabled={sealedSecretName && isImmutable}
              />
            </Section>
            <AdvancedSettings>
              <Section title='Metadata'>
                <KeyValue
                  title='Labels'
                  subTitle='Add labels to specify identifying attributes of the Secret.'
                  name='spec.template.metadata.labels'
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
                  subTitle='Add annotations to store custom metadata about the Secret.'
                  name='spec.template.metadata.annotations'
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
                  subTitle='Add finalizers to specify conditions that need to be met before a Secret can be marked for deletion.'
                  name='spec.template.metadata.finalizers'
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
                onDelete={() => del({ namespace, sealedSecretName })}
                resourceName={watch('metadata.name')}
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
