import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import Section from 'components/Section'
import PaperLayout from 'layouts/Paper'
import { useEffect, useMemo } from 'react'
import { FormProvider, Resolver, useFieldArray, useForm } from 'react-hook-form'
import { useSession } from 'providers/Session'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'
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
    resolver: yupResolver(platformSettingsSchema) as Resolver<PlatformSettingsFormValues>,

    defaultValues: EMPTY_FORM_VALUES,
  })

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods

  const {
    fields: nodeSelectorFields,
    append: appendNodeSelector,
    remove: removeNodeSelector,
  } = useFieldArray({
    control,
    name: 'nodeSelector',
  })

  useEffect(() => {
    if (!data?.otomi) return

    reset(formValues)
  }, [data, formValues, reset])

  const onSubmit = async (values: PlatformSettingsFormValues) => {
    /*
     * Preserve settings that are deliberately not rendered on this
     * static page.
     */
    const updatedOtomiSettings: OtomiSettings = {
      ...otomiSettings,

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
        <LandingHeader
          title='Platform settings'
          subtitle='Configure platform-wide platform, registry, and scheduling settings.'
        />

        <Section title='Platform'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ControlledCheckbox name='hasExternalDNS' control={control} label='Use external DNS' />
            </Grid>

            <Grid item xs={12}>
              <ControlledCheckbox name='hasExternalIDP' control={control} label='Use external identity provider' />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register('version')}
                label='Platform version'
                error={Boolean(errors.version)}
                errorText={errors.version?.message}
                helperText='The platform release version used by App Platform.'
                width='fullwidth'
              />
            </Grid>
          </Grid>
        </Section>

        <Section title='Global pull secret'>
          <Typography
            variant='body2'
            sx={{
              mb: 2,
              color: 'text.secondary',
            }}
          >
            Configure registry credentials that are attached to the default service account in every team namespace.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register('globalPullSecret.server')}
                label='Registry server'
                error={Boolean(errors.globalPullSecret?.server)}
                errorText={errors.globalPullSecret?.server?.message}
                helperText='For example: docker.io'
                width='fullwidth'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register('globalPullSecret.username')}
                label='Username'
                error={Boolean(errors.globalPullSecret?.username)}
                errorText={errors.globalPullSecret?.username?.message}
                width='fullwidth'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register('globalPullSecret.password')}
                label='Password'
                type='password'
                autoComplete='new-password'
                error={Boolean(errors.globalPullSecret?.password)}
                errorText={errors.globalPullSecret?.password?.message}
                width='fullwidth'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register('globalPullSecret.email')}
                label='Email'
                type='email'
                error={Boolean(errors.globalPullSecret?.email)}
                errorText={errors.globalPullSecret?.email?.message}
                width='fullwidth'
              />
            </Grid>
          </Grid>
        </Section>

        <Section title='Node selector'>
          <Typography
            variant='body2'
            sx={{
              mb: 2,
              color: 'text.secondary',
            }}
          >
            Restrict platform services to nodes matching these Kubernetes labels.
          </Typography>

          <Grid container spacing={2}>
            {nodeSelectorFields.map((field, index) => (
              <Grid item xs={12} key={field.id}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      {...register(`nodeSelector.${index}.name`)}
                      label='Label name'
                      error={Boolean(errors.nodeSelector?.[index]?.name)}
                      errorText={errors.nodeSelector?.[index]?.name?.message}
                      helperText='For example: node-role.kubernetes.io/platform'
                      width='fullwidth'
                      noMarginTop
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <TextField
                      {...register(`nodeSelector.${index}.value`)}
                      label='Label value'
                      error={Boolean(errors.nodeSelector?.[index]?.value)}
                      errorText={errors.nodeSelector?.[index]?.value?.message}
                      helperText='For example: true'
                      width='fullwidth'
                      noMarginTop
                    />
                  </Box>

                  <IconButton
                    aria-label={`Remove node selector ${index + 1}`}
                    onClick={() => removeNodeSelector(index)}
                    sx={{
                      mt: 3.5,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                type='button'
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={() =>
                  appendNodeSelector({
                    name: '',
                    value: '',
                  })
                }
              >
                Add node selector
              </Button>
            </Grid>
          </Grid>
        </Section>

        <LoadingButton
          type='submit'
          variant='contained'
          loading={isUpdating}
          disabled={!isDirty || isFetching}
          sx={{
            mt: 3,
          }}
        >
          Save
        </LoadingButton>
      </form>
    </FormProvider>
  )

  return <PaperLayout comp={comp} loading={isLoading} title='Platform settings' />
}
