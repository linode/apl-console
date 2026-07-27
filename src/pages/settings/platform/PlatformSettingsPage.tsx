import LoadingButton from '@mui/lab/LoadingButton'
import { Box } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import Section from 'components/Section'
import PaperLayout from 'layouts/Paper'
import { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSession } from 'providers/Session'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'
import KeyValue from 'components/forms/KeyValue'
import { Divider } from 'components/Divider'
import FormRow from 'components/forms/FormRow'
import { PlatformSettingsFormValues, platformSettingsSchema } from './platform-settings.validator'

interface OtomiSettings extends Omit<PlatformSettingsFormValues, 'globalPullSecret' | 'nodeSelector'> {
  globalPullSecret?: {
    username?: string
    password?: string
    email?: string
    server?: string
  } | null

  nodeSelector?: Array<{
    name?: string
    value?: string
  }> | null

  isMultitenant?: boolean
  isPreInstalled?: boolean
  adminPassword?: string
  useORCS?: boolean
  aiEnabled?: boolean
  git?: unknown

  [key: string]: unknown
}

const EMPTY_FORM_VALUES: PlatformSettingsFormValues = {
  hasExternalDNS: false,
  hasExternalIDP: false,
  version: '',
  globalPullSecret: {
    username: '',
    password: '',
    email: '',
    server: 'docker.io',
  },
  nodeSelector: [],
}

const hasGlobalPullSecretValues = (globalPullSecret: PlatformSettingsFormValues['globalPullSecret']): boolean =>
  Boolean(
    globalPullSecret.username ||
      globalPullSecret.password ||
      globalPullSecret.email ||
      (globalPullSecret.server && globalPullSecret.server !== 'docker.io'),
  )

export default function PlatformSettingsPage() {
  const { refetchSettings } = useSession()

  const { data, isLoading, isFetching, refetch } = useGetSettingsQuery({
    ids: ['otomi'],
  })

  const [editSettings, { isLoading: isUpdating }] = useEditSettingsMutation()

  const otomiSettings = useMemo(() => (data?.otomi ?? {}) as OtomiSettings, [data])

  const formValues = useMemo<PlatformSettingsFormValues>(
    () => ({
      hasExternalDNS: otomiSettings.hasExternalDNS ?? false,

      hasExternalIDP: otomiSettings.hasExternalIDP ?? false,

      version: otomiSettings.version ?? '',

      globalPullSecret: {
        username: otomiSettings.globalPullSecret?.username ?? '',

        password: otomiSettings.globalPullSecret?.password ?? '',

        email: otomiSettings.globalPullSecret?.email ?? '',

        server: otomiSettings.globalPullSecret?.server ?? 'docker.io',
      },

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
    /*
     * Preserve settings that are deliberately not rendered on this
     * static page.
     */
    const { git, ...otomiSettingsWithoutGit } = otomiSettings
    const updatedOtomiSettings = {
      ...otomiSettingsWithoutGit,
      git,

      hasExternalDNS: values.hasExternalDNS,

      hasExternalIDP: values.hasExternalIDP,

      version: values.version,

      /*
       * The API schema allows globalPullSecret to be null. Avoid
       * storing an object containing only empty strings.
       */
      globalPullSecret: hasGlobalPullSecretValues(values.globalPullSecret) ? values.globalPullSecret : null,

      /*
       * Remove completely empty selector rows before submitting.
       */
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
  }

  const comp = (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <LandingHeader title='Platform settings' />

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
                sx={{ my: 2 }}
                name='hasExternalDNS'
                control={control}
                label='Use external DNS'
                explainertext='Enable this when DNS records are managed outside App Platform. App Platform will not manage external DNS records.'
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <ControlledCheckbox
                sx={{ my: 2 }}
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box>
              <TextField
                {...register('globalPullSecret.server')}
                label='Registry server'
                error={Boolean(errors.globalPullSecret?.server)}
                errorText={errors.globalPullSecret?.server?.message}
                helperText='For example: docker.io'
                width='fullwidth'
              />
            </Box>

            <Divider sx={{ mt: 3, mb: 1 }} />

            <Box
              sx={{
                display: 'flex',
                gap: '5px',
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
              }}
            >
              <FormRow spacing={10}>
                <TextField
                  {...register('globalPullSecret.username')}
                  label='Username'
                  error={Boolean(errors.globalPullSecret?.username)}
                  errorText={errors.globalPullSecret?.username?.message}
                  width='large'
                />

                <TextField
                  {...register('globalPullSecret.password')}
                  label='Password'
                  type='password'
                  autoComplete='new-password'
                  error={Boolean(errors.globalPullSecret?.password)}
                  errorText={errors.globalPullSecret?.password?.message}
                  width='large'
                />
              </FormRow>
            </Box>

            <Box sx={{ mt: 2 }}>
              <TextField
                {...register('globalPullSecret.email')}
                label='Email (optional)'
                type='email'
                error={Boolean(errors.globalPullSecret?.email)}
                errorText={errors.globalPullSecret?.email?.message}
                helperText='Optional contact email for the registry account.'
                width='fullwidth'
              />
            </Box>
          </Box>
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
