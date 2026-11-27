import { yupResolver } from '@hookform/resolvers/yup'
import { encryptSecretItem } from '@linode/kubeseal-encrypt'
import { Alert, Box, Button, Typography } from '@mui/material'
import { LandingHeader } from 'components/LandingHeader'
import RLink from 'components/Link'
import Section from 'components/Section'
import { TextField } from 'components/forms/TextField'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import {
  CreateAplNamespaceSealedSecretApiArg,
  useCreateAplNamespaceSealedSecretMutation,
  useEditAplNamespaceSealedSecretMutation,
  useEditSettingsMutation,
  useGetAplNamespaceSealedSecretsQuery,
  useGetSettingsQuery,
} from 'redux/otomiApi'
import { GLOBAL_PULL_SECRET } from 'utils/constants'
import snack from 'utils/snack'
import * as yup from 'yup'

const schema = yup.object({
  server: yup.string().trim().required('Registry server is required'),
  username: yup.string().trim().required('Username is required'),
  email: yup.string().trim().email('Enter a valid email address'),
  password: yup.string().when('$hasPassword', {
    is: true,
    then: (value) => value.optional(),
    otherwise: (value) => value.required('Password is required'),
  }),
})

type FormValues = yup.InferType<typeof schema>
type SecretBody = CreateAplNamespaceSealedSecretApiArg['body']

export default function GlobalPullSecretPage() {
  const history = useHistory()
  const { sealedSecretsPEM, refetchSettings } = useSession()
  const settings = useGetSettingsQuery({ ids: ['otomi'] })
  const secrets = useGetAplNamespaceSealedSecretsQuery({ namespace: GLOBAL_PULL_SECRET.namespace })
  const [create] = useCreateAplNamespaceSealedSecretMutation()
  const [update] = useEditAplNamespaceSealedSecretMutation()
  const [editSettings] = useEditSettingsMutation()
  const [savedSecret, setSavedSecret] = useState<SecretBody>()
  const [saveError, setSaveError] = useState('')
  const [isDisabling, setIsDisabling] = useState(false)
  const secret = savedSecret ?? secrets.data?.find(({ metadata }) => metadata.name === GLOBAL_PULL_SECRET.name)
  const hasPassword = Boolean(secret?.spec.encryptedData[GLOBAL_PULL_SECRET.passwordKey])
  const immutable = Boolean(secret?.spec.template?.immutable)
  const otomi = settings.data?.otomi
  const {
    register,
    reset,
    resetField,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    context: { hasPassword },
    defaultValues: { server: 'docker.io', username: '', email: '', password: '' },
  })

  useEffect(() => {
    if (!otomi) return
    reset({
      server: otomi.globalPullSecret?.server || 'docker.io',
      username: otomi.globalPullSecret?.username || '',
      email: otomi.globalPullSecret?.email || '',
      password: '',
    })
  }, [otomi, reset])

  const loading = settings.isLoading || secrets.isLoading
  const loadError = settings.isError || secrets.isError || (!loading && !otomi)
  const busy = isSubmitting || isDisabling || settings.isFetching || secrets.isFetching
  const cannotCreatePassword = !hasPassword && immutable
  const configured = Boolean(
    otomi?.globalPullSecret?.server || otomi?.globalPullSecret?.username || otomi?.globalPullSecret?.email,
  )

  const saveSettings = async (globalPullSecret: typeof otomi.globalPullSecret) => {
    const { git: _git, adminPassword: _adminPassword, ...currentSettings } = otomi
    await editSettings({
      settingId: 'otomi',
      body: { otomi: { ...currentSettings, globalPullSecret } },
    }).unwrap()
    refetchSettings()
  }

  const onSubmit = async ({ server, username, email, password }: FormValues) => {
    setSaveError('')
    let stage = 'password'
    try {
      if (password) {
        if (!sealedSecretsPEM) throw new Error('SealedSecrets encryption key is unavailable')
        const encryptedPassword = await encryptSecretItem(sealedSecretsPEM, GLOBAL_PULL_SECRET.namespace, password)
        const body: SecretBody = {
          apiVersion: 'bitnami.com/v1alpha1',
          kind: 'SealedSecret',
          metadata: { ...secret?.metadata, name: GLOBAL_PULL_SECRET.name, namespace: GLOBAL_PULL_SECRET.namespace },
          spec: {
            ...secret?.spec,
            template: secret?.spec.template ?? { type: 'kubernetes.io/opaque' },
            encryptedData: { ...secret?.spec.encryptedData, [GLOBAL_PULL_SECRET.passwordKey]: encryptedPassword },
          },
        }
        const args = { namespace: GLOBAL_PULL_SECRET.namespace, body }
        const stored = secret
          ? await update({ ...args, sealedSecretName: GLOBAL_PULL_SECRET.name }).unwrap()
          : await create(args).unwrap()
        setSavedSecret(stored)
        resetField('password')
      }
      stage = 'settings'
      await saveSettings({ server, username, ...(email && { email }) })
      snack.success('Global pull secret saved successfully')
      history.push('/settings/platform')
    } catch {
      setSaveError(
        stage === 'password'
          ? 'Unable to encrypt or save the password. Check the encryption key and platform secret, then retry.'
          : 'The password is stored, but registry settings could not be saved. Retry to finish setup.',
      )
    }
  }

  const disable = async () => {
    setSaveError('')
    setIsDisabling(true)
    try {
      await saveSettings(null)
      snack.success('Global pull secret disabled. The encrypted password is retained in Platform Secrets.')
      history.push('/settings/platform')
    } catch {
      setSaveError('Unable to disable the global pull secret. Please retry.')
    } finally {
      setIsDisabling(false)
    }
  }

  const comp = loadError ? (
    <Alert severity='error'>
      Unable to load the platform settings or secrets. Reload the page before making changes.
    </Alert>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <LandingHeader title='Global pull secret' />
      <Section title='Platform secret'>
        <Typography sx={{ mb: 2 }}>
          This guide stores only the registry password in {GLOBAL_PULL_SECRET.namespace}/{GLOBAL_PULL_SECRET.name},
          using the predefined key {GLOBAL_PULL_SECRET.passwordKey}. Registry server, username, and email are not secret
          and remain platform settings. Other secret keys are preserved.
        </Typography>
        {secret && <RLink to={GLOBAL_PULL_SECRET.secretPath}>View encrypted data in Platform Secrets</RLink>}
        {!hasPassword && <Alert severity='info'>Enter registry credentials to bootstrap the global pull secret.</Alert>}
        {immutable && (
          <Alert severity='warning'>The platform secret is immutable. Its password cannot be added or replaced.</Alert>
        )}
      </Section>
      <Section title='Registry' description='Used for image pulls in platform and team namespaces.'>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            {...register('server')}
            label='Registry server'
            helperText='For example: docker.io'
            error={Boolean(errors.server)}
            errorText={errors.server?.message}
            disabled={busy}
            width='fullwidth'
          />
          <TextField
            {...register('username')}
            label='Username'
            error={Boolean(errors.username)}
            errorText={errors.username?.message}
            disabled={busy}
            width='fullwidth'
          />
          <TextField
            {...register('password')}
            label={hasPassword ? 'New password (optional)' : 'Password'}
            type='password'
            autoComplete='new-password'
            helperText={hasPassword ? 'Leave blank to keep the stored encrypted password.' : 'Encrypted before saving.'}
            error={Boolean(errors.password)}
            errorText={errors.password?.message}
            disabled={busy || immutable}
            width='fullwidth'
          />
          <TextField
            {...register('email')}
            label='Email (optional)'
            type='email'
            error={Boolean(errors.email)}
            errorText={errors.email?.message}
            disabled={busy}
            width='fullwidth'
          />
        </Box>
      </Section>
      {saveError && <Alert severity='error'>{saveError}</Alert>}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button type='button' onClick={() => history.push('/settings/platform')} disabled={busy}>
          Cancel
        </Button>
        {configured && (
          <Button type='button' onClick={disable} disabled={busy}>
            Disable global pull secret
          </Button>
        )}
        <Button type='submit' variant='contained' disabled={busy || cannotCreatePassword || (!isDirty && hasPassword)}>
          {hasPassword ? 'Save Changes' : 'Create global pull secret'}
        </Button>
      </Box>
    </form>
  )
  return <PaperLayout title='Global pull secret' loading={loading} comp={comp} />
}
