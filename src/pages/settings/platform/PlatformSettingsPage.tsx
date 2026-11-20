import LoadingButton from '@mui/material/Button'
import { Alert, Box, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import { useHistory } from 'react-router-dom'
import Section from 'components/Section'
import PaperLayout from 'layouts/Paper'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSession } from 'providers/Session'
import {
  GetSettingsApiResponse,
  useEditSettingsMutation,
  useGetAplNamespaceSealedSecretsQuery,
  useGetSettingsQuery,
} from 'redux/otomiApi'
import KeyValue from 'components/forms/KeyValue'
import { Divider } from 'components/Divider'
import RLink from 'components/Link'
import snack from 'utils/snack'
import { GLOBAL_PULL_SECRET } from 'utils/constants'
import { PlatformSettingsFormValues, platformSettingsSchema } from './platform-settings.validator'

const EMPTY_FORM_VALUES: PlatformSettingsFormValues = {
  hasExternalDNS: false,
  hasExternalIDP: false,
  version: '',
  nodeSelector: [],
}

export default function PlatformSettingsPage() {
  const { refetchSettings } = useSession()
  const history = useHistory()

  const { data, isLoading, isFetching, refetch } = useGetSettingsQuery({
    ids: ['otomi'],
  })

  const [editSettings, { isLoading: isUpdating }] = useEditSettingsMutation()
  const {
    data: secrets,
    isFetching: isFetchingSecrets,
    isError: isSecretsError,
  } = useGetAplNamespaceSealedSecretsQuery({ namespace: GLOBAL_PULL_SECRET.namespace })
  const hasPassword = Boolean(
    secrets?.find(({ metadata }) => metadata.name === GLOBAL_PULL_SECRET.name)?.spec.encryptedData[
      GLOBAL_PULL_SECRET.passwordKey
    ],
  )

  const otomiSettings = useMemo<GetSettingsApiResponse['otomi']>(() => data?.otomi ?? { version: '' }, [data])

  const formValues = useMemo<PlatformSettingsFormValues>(
    () => ({
      hasExternalDNS: otomiSettings.hasExternalDNS ?? false,

      hasExternalIDP: otomiSettings.hasExternalIDP ?? false,

      version: otomiSettings.version ?? '',

      nodeSelector: Array.isArray(otomiSettings.nodeSelector)
        ? otomiSettings.nodeSelector.map(({ name, value }) => ({
            name: name ?? '',
            value: value ?? '',
          }))
        : [],
    }),
    [otomiSettings],
  )

  const methods = useForm<PlatformSettingsFormValues>({
    resolver: yupResolver(platformSettingsSchema),
    defaultValues: EMPTY_FORM_VALUES,
  })

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods

  useEffect(() => {
    if (!data?.otomi) return

    reset(formValues)
  }, [data, formValues, reset])

  const onSubmit = async (values: PlatformSettingsFormValues) => {
    const { git: _git, adminPassword: _adminPassword, globalPullSecret, ...otomiSettingsWithoutGit } = otomiSettings

    const updatedOtomiSettings = {
      ...otomiSettingsWithoutGit,

      hasExternalDNS: values.hasExternalDNS,
      hasExternalIDP: values.hasExternalIDP,
      version: values.version,

      globalPullSecret: globalPullSecret
        ? {
            server: globalPullSecret.server,
            username: globalPullSecret.username,
            email: globalPullSecret.email,
          }
        : globalPullSecret,

      nodeSelector: values.nodeSelector
        .map(({ name, value }) => ({
          name: name.trim(),
          value: value.trim(),
        }))
        .filter(({ name, value }) => name.length > 0 || value.length > 0),
    }

    await editSettings({
      settingId: 'otomi',
      body: {
        otomi: updatedOtomiSettings,
      },
    }).unwrap()

    await Promise.all([refetch(), refetchSettings()])

    reset(values)

    snack.success('Platform settings saved successfully')

    history.push('/settings')
  }

  const comp = (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <LandingHeader title='Platform' />

        <Section title='Platform'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 900,
            }}
          >
            <Box>
              <TextField
                {...register('version')}
                label='Platform version'
                error={Boolean(errors.version)}
                errorText={errors.version?.message}
                helperText='The platform release version used by App Platform.'
                width='fullwidth'
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box>
              <ControlledCheckbox
                name='hasExternalDNS'
                control={control}
                label='Use external DNS'
                explainertext='Enable this when DNS records are managed outside App Platform. App Platform will not manage external DNS records.'
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <ControlledCheckbox
                name='hasExternalIDP'
                control={control}
                label='Use external identity provider'
                explainertext='Enable this when user authentication is managed by an external identity provider instead of the built-in identity provider.'
              />
            </Box>
          </Box>
        </Section>

        <Section
          title='Global pull secret'
          description='Configure registry credentials that are attached to the default service account in every team namespace.'
        >
          <Typography sx={{ mb: 1 }}>
            The password is managed in Platform Secrets. Registry details are configured in the guided setup.
          </Typography>
          {isFetchingSecrets && <Typography>Checking platform secret...</Typography>}
          {isSecretsError && <Alert severity='error'>Unable to load the global pull secret.</Alert>}
          {!isFetchingSecrets && !isSecretsError && (
            <Box>
              <Typography sx={{ mb: 1 }}>
                {otomiSettings.globalPullSecret?.server && `Registry: ${otomiSettings.globalPullSecret.server}. `}
                {hasPassword ? 'An encrypted password is stored.' : 'No encrypted password is configured.'}
              </Typography>
              {hasPassword && !otomiSettings.globalPullSecret?.username && (
                <Alert severity='info' sx={{ mb: 1 }}>
                  Complete registry setup to enable the global pull secret.
                </Alert>
              )}
              <RLink to={GLOBAL_PULL_SECRET.setupPath}>
                {hasPassword ? 'Manage global pull secret' : 'Create global pull secret'}
              </RLink>
              {hasPassword && (
                <Box sx={{ mt: 1 }}>
                  <RLink to={GLOBAL_PULL_SECRET.secretPath}>View encrypted data in Platform Secrets</RLink>
                </Box>
              )}
            </Box>
          )}
        </Section>

        <Section>
          <KeyValue
            {...register('nodeSelector')}
            title='Node selector'
            subTitle='Restrict platform workloads to nodes matching these Kubernetes labels.'
            noMarginTop
            keyLabel='Name'
            valueLabel='Value'
            addLabel='Add node selector'
            keySize='large'
            valueSize='large'
            compressed
            error={Boolean(errors.nodeSelector)}
            errorText={typeof errors.nodeSelector?.message === 'string' ? errors.nodeSelector.message : undefined}
            helperText='For example: node-role.kubernetes.io/platform = true'
          />
        </Section>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 3,
          }}
        >
          <LoadingButton type='submit' variant='contained' loading={isUpdating} disabled={!isDirty || isFetching}>
            Save Changes
          </LoadingButton>
        </Box>
      </form>
    </FormProvider>
  )

  return <PaperLayout comp={comp} loading={isLoading} title='Platform settings' />
}
