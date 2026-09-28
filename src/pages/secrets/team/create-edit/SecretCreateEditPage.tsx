import { Box, Grid, MenuItem } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { cloneDeep, isEmpty, isEqual } from 'lodash'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import { TextField } from 'components/forms/TextField'
import Section from 'components/Section'
import KeyValue from 'components/forms/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import AdvancedSettings from 'components/AdvancedSettings'
import DeleteButton from 'components/DeleteButton'
import InformationBanner from 'components/InformationBanner'

import {
  CreateAplSealedSecretApiArg,
  useCreateAplSealedSecretMutation,
  useDeleteAplSealedSecretMutation,
  useEditAplSealedSecretMutation,
  useGetAplSealedSecretQuery,
  useGetAplSealedSecretsQuery,
} from 'redux/otomiApi'

import { encryptSecretItem } from '@linode/kubeseal-encrypt'
import { useSession } from 'providers/Session'
import { mapObjectToKeyValueArray, valueArrayToObject } from 'utils/helpers'
import { useAppSelector } from 'redux/hooks'

import { useStyles } from './create-edit-secrets.styles'
import { createSealedSecretApiResponseSchema, secretTypes } from './create-edit-secrets.validator'
import { SecretTypeFields } from './SecretTypeFields'

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
    useCreateAplSealedSecretMutation()

  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplSealedSecretMutation()

  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplSealedSecretMutation()

  const { data, isLoading, isFetching, isError, refetch } = useGetAplSealedSecretQuery(
    {
      teamId,
      sealedSecretName,
    },
    {
      skip: !sealedSecretName,
    },
  )

  const { data: teamSealedSecrets, isLoading: isLoadingTeamSealedSecrets } = useGetAplSealedSecretsQuery(
    { teamId },
    { skip: !teamId },
  )

  const isImmutable = data?.spec?.template?.immutable || false

  const existingNames = (teamSealedSecrets ?? [])
    .map((secret) => secret?.metadata?.name)
    .filter((name): name is string => Boolean(name))

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  const formData = cloneDeep(data) as any

  if (!isEmpty(data)) {
    formData.spec.encryptedData = mapObjectToKeyValueArray(data?.spec?.encryptedData as Record<string, string>)

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
    context: {
      existingNames,
      currentName: data?.metadata?.name,
      validateOnSubmit: !sealedSecretName,
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

  useEffect(() => {
    if (data) reset(formData as SealedSecretFormData)
  }, [data])

  useEffect(() => {
    if (sealedSecretName) return

    const type = watch('spec.template.type')

    setValue('spec.encryptedData', getDefaultEncryptedDataForType(type))
  }, [watch('spec.template.type'), sealedSecretName])

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete

  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) {
    if (isCoderepository) {
      history.push(`/teams/${teamId}/code-repositories/create`, {
        coderepository: false,
        prefilled: {
          ...prefilled,
          secret: dataCreate?.metadata?.name,
        },
      })
    } else return <Redirect to={`/teams/${teamId}/secrets`} />
  }

  const onSubmit = async () => {
    const formValues = cloneDeep(watch())

    const namespace = formValues.metadata.namespace || `team-${teamId}`

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
              formValues.spec?.template?.metadata?.annotations as {
                key: string
                value: string
              }[],
            ),
            labels: valueArrayToObject(
              formValues.spec?.template?.metadata?.labels as {
                key: string
                value: string
              }[],
            ),
            finalizers: formValues.spec?.template?.metadata?.finalizers?.filter((item: string) => item.trim() !== ''),
          },
        },
      },
    }

    if (sealedSecretName) {
      const originalEncryptedData: Record<string, string> = data?.spec?.encryptedData || {}

      if (Array.isArray(formValues.spec.encryptedData)) {
        const encryptedEntries = await Promise.all(
          formValues.spec.encryptedData
            .filter(({ key, value }: { key: string; value: string }) => key && value)
            .map(async ({ key, value }: { key: string; value: string }) => {
              const originalValue = originalEncryptedData[key]

              if (!originalValue || value !== originalValue)
                return [key, await encryptValue(sealedSecretsPEM, namespace, value)]

              return [key, originalValue]
            }),
        )

        if (encryptedEntries.length > 0) body.spec.encryptedData = Object.fromEntries(encryptedEntries)
      }

      update({
        teamId,
        sealedSecretName,
        body,
      })
    } else {
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

      create({
        teamId,
        body,
      })
    }
  }

  const loading = isLoading || isFetching || isLoadingTeamSealedSecrets

  const error = isError

  if (loading || (sealedSecretName && !data?.metadata?.name))
    return <PaperLayout loading title={t('TITLE_SEALEDSECRET')} />

  return (
    <Grid className={classes.root}>
      <PaperLayout
        loading={loading || error}
        title={t('TITLE_SEALEDSECRET', {
          sealedSecretName,
          role: 'team',
        })}
      >
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-secrets'
          title={sealedSecretName ? data.metadata.name : 'Create'}
          hideCrumbX={[0, 1]}
        />

        {sealedSecretName && isImmutable && (
          <InformationBanner
            sx={{ mb: 2 }}
            message='This secret is marked as immutable and therefore the Secret data cannot be modified, only deleted.'
          />
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='General' description='Configure the name and type of the Secret.'>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <TextField
                  label='Secret name'
                  width='large'
                  {...register('metadata.name')}
                  error={!!errors.metadata?.name}
                  helperText={errors.metadata?.name?.message?.toString()}
                  disabled={!!sealedSecretName}
                />

                <TextField
                  label='Secret type'
                  select
                  width='large'
                  error={!!errors.spec?.template?.type}
                  helperText={
                    (errors.spec?.template?.type as any)?.message?.toString() ||
                    'Select the Secret type for the appropriate handling of the Secret data.'
                  }
                  {...register('spec.template.type')}
                  value={watch('spec.template.type') || 'kubernetes.io/opaque'}
                  disabled={!!sealedSecretName}
                >
                  {secretTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Section>

            <Section>
              {sealedSecretName && !isImmutable && (
                <InformationBanner
                  sx={{ mb: 2 }}
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
            </Section>

            <Section title='Options' description='Configure additional behavior for this Secret.'>
              <ControlledCheckbox
                sx={{ my: 1 }}
                name='spec.template.immutable'
                control={control}
                label='Immutable'
                explainertext='If enabled, the Secret data cannot be updated after creation.'
                disabled={sealedSecretName && isImmutable}
              />
            </Section>

            <AdvancedSettings title='Advanced Settings' closed>
              <Section title='Labels' description='Add labels to specify identifying attributes of the Secret.'>
                <KeyValue
                  name='spec.template.metadata.labels'
                  keyLabel='key'
                  valueLabel='value'
                  showLabel={false}
                  compressed
                  noMarginTop
                  keySize='large'
                  valueSize='large'
                  addLabel='Add label'
                />
              </Section>

              <Section title='Annotations' description='Add annotations to store custom metadata about the Secret.'>
                <KeyValue
                  name='spec.template.metadata.annotations'
                  keyLabel='key'
                  valueLabel='value'
                  showLabel={false}
                  compressed
                  noMarginTop
                  keySize='large'
                  valueSize='large'
                  addLabel='Add annotation'
                />
              </Section>

              <Section
                title='Finalizers'
                description='Add finalizers to specify conditions that must be met before the Secret can be deleted.'
              >
                <KeyValue
                  name='spec.template.metadata.finalizers'
                  keyLabel='key'
                  valueLabel='value'
                  onlyValue
                  hideKeyField
                  showLabel={false}
                  compressed
                  noMarginTop
                  keySize='medium'
                  valueSize='large'
                  addLabel='Add finalizer'
                />
              </Section>
            </AdvancedSettings>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              {sealedSecretName && (
                <DeleteButton
                  onDelete={() =>
                    del({
                      teamId,
                      sealedSecretName,
                    })
                  }
                  resourceName={watch('metadata.name')}
                  resourceType='secret'
                  data-cy='button-delete-secret'
                  loading={isLoadingDelete}
                  disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate}
                />
              )}

              <LoadingButton
                type='submit'
                variant='contained'
                color='primary'
                sx={{
                  textTransform: 'none',
                }}
                loading={isLoadingCreate || isLoadingUpdate}
                disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete || isEqual(formData, watch())}
              >
                {sealedSecretName ? 'Save Changes' : 'Create Secret'}
              </LoadingButton>
            </Box>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
