import LoadingButton from '@mui/lab/LoadingButton'
import { Grid } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import Section from 'components/Section'
import PaperLayout from 'layouts/Paper'
import { useEffect, useMemo } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { useSession } from 'providers/Session'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'
import { PlatformSettingsFormValues, platformSettingsSchema } from './platform-settings.validator'

interface OtomiSettings extends PlatformSettingsFormValues {
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
}

export default function PlatformSettingsPage() {
  const { refetchSettings } = useSession()

  const { data, isLoading, isFetching, refetch } = useGetSettingsQuery({ ids: ['otomi'] })

  const [editSettings, { isLoading: isUpdating }] = useEditSettingsMutation()

  const otomiSettings = useMemo(() => (data?.otomi ?? {}) as OtomiSettings, [data])

  const formValues = useMemo<PlatformSettingsFormValues>(
    () => ({
      hasExternalDNS: otomiSettings.hasExternalDNS ?? false,
      hasExternalIDP: otomiSettings.hasExternalIDP ?? false,
      version: otomiSettings.version ?? '',
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

  useEffect(() => {
    if (!data?.otomi) return

    reset(formValues)
  }, [data, formValues, reset])

  const onSubmit = async (values: PlatformSettingsFormValues) => {
    /*
     * Preserve fields that are deliberately not rendered on this page.
     *
     * The v1 settings endpoint receives the complete `otomi` object. Sending
     * only the visible fields could otherwise remove hidden installation or
     * system-managed values.
     */
    const updatedOtomiSettings: OtomiSettings = {
      ...otomiSettings,
      ...values,
    }

    await editSettings({
      settingId: 'otomi',
      body: {
        otomi: updatedOtomiSettings,
      },
    }).unwrap()

    await Promise.all([refetch(), refetchSettings()])
  }

  const comp = (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <LandingHeader
          title='Platform settings'
          subtitle='Configure platform-wide DNS, identity provider, and version settings.'
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
                helperText={errors.version?.message ?? 'The platform version or image tag used by App Platform.'}
                fullWidth
              />
            </Grid>
          </Grid>
        </Section>

        <LoadingButton
          type='submit'
          variant='contained'
          loading={isUpdating}
          disabled={!isDirty || isFetching}
          sx={{ mt: 3 }}
        >
          Save
        </LoadingButton>
      </form>
    </FormProvider>
  )

  return <PaperLayout comp={comp} loading={isLoading} title='Platform settings' />
}
