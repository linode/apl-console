import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CreateAplNamespaceSealedSecretApiArg,
  GetAplNamespaceSealedSecretsApiResponse,
  GetSettingsApiResponse,
} from 'redux/otomiApi'
import GlobalPullSecretPage from './GlobalPullSecretPage'

const mockCreate = jest.fn()
const mockUpdate = jest.fn()
const mockEditSettings = jest.fn()
const mockEncrypt = jest.fn()
const mockPush = jest.fn()
const mockRefetchSettings = jest.fn()
const mockSuccess = jest.fn()
let mockPEM = 'public-key'
let mockSettings: GetSettingsApiResponse
let mockSecrets: GetAplNamespaceSealedSecretsApiResponse
let mockSecretsError = false
let mockSettingsError = false
let mockFetching = false

jest.mock('@linode/kubeseal-encrypt', () => ({
  encryptSecretItem: (...args: unknown[]) => mockEncrypt(...args),
}))
jest.mock('react-router-dom', () => ({
  useHistory: () => ({ push: mockPush }),
}))
jest.mock('providers/Session', () => ({
  useSession: () => ({ sealedSecretsPEM: mockPEM, refetchSettings: mockRefetchSettings }),
}))
jest.mock('redux/otomiApi', () => ({
  useGetSettingsQuery: () => ({ data: mockSettings, isError: mockSettingsError, isFetching: mockFetching }),
  useGetAplNamespaceSealedSecretsQuery: () => ({
    data: mockSecrets,
    isError: mockSecretsError,
    isFetching: mockFetching,
  }),
  useCreateAplNamespaceSealedSecretMutation: () => [mockCreate],
  useEditAplNamespaceSealedSecretMutation: () => [mockUpdate],
  useEditSettingsMutation: () => [mockEditSettings],
}))
jest.mock('utils/snack', () => ({
  __esModule: true,
  default: { success: (...args: unknown[]) => mockSuccess(...args) },
}))
jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ comp }: { comp: React.ReactNode }) => <div>{comp}</div>,
}))
jest.mock('components/LandingHeader', () => ({
  LandingHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('components/Section', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
}))
jest.mock('components/Link', () => ({
  __esModule: true,
  default: React.forwardRef<HTMLAnchorElement, { to: string; children: React.ReactNode }>(function MockLink(
    { to, children, ...props },
    ref,
  ) {
    return (
      <a ref={ref} href={to} {...props}>
        {children}
      </a>
    )
  }),
}))
jest.mock('components/forms/TextField', () => ({
  TextField: React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
      label: string
      errorText?: string
      helperText?: string
      error?: boolean
      width?: string
      name?: string
    }
  >(function MockTextField({ label, errorText, helperText, error, width, ...props }, ref) {
    return (
      <label htmlFor={props.name} data-width={width}>
        {label}
        <input ref={ref} id={props.name} aria-label={label} aria-invalid={Boolean(error)} {...props} />
        {errorText && <span>{errorText}</span>}
        {helperText && <span>{helperText}</span>}
      </label>
    )
  }),
}))

const existingSecret: GetAplNamespaceSealedSecretsApiResponse[number] = {
  kind: 'SealedSecret',
  metadata: { name: 'otomi-secrets', labels: { 'apl.io/teamId': 'platform' } },
  spec: {
    encryptedData: { adminPassword: 'encrypted-admin', globalPullSecret_password: 'old-encrypted-password' },
    template: {
      type: 'kubernetes.io/opaque',
      metadata: { annotations: { keep: 'annotation' }, labels: { keep: 'label' }, finalizers: ['keep-finalizer'] },
    },
  },
  status: {},
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: /^(Create global pull secret|Save Changes)$/ }))
}

async function enterCredentials() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Username'), 'registry-user')
  await user.type(screen.getByLabelText('Password'), 'registry-password')
}

describe('GlobalPullSecretPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPEM = 'public-key'
    mockSettings = { otomi: { version: 'v1', nodeSelector: [], adminPassword: 'encrypted-admin' } }
    mockSecrets = []
    mockSecretsError = false
    mockSettingsError = false
    mockFetching = false
    mockEncrypt.mockResolvedValue('new-encrypted-password')
    const store = ({ body }: CreateAplNamespaceSealedSecretApiArg) => ({ unwrap: () => Promise.resolve(body) })
    mockCreate.mockImplementation(store)
    mockUpdate.mockImplementation(store)
    mockEditSettings.mockReturnValue({ unwrap: () => Promise.resolve() })
    mockRefetchSettings.mockResolvedValue(undefined)
  })

  it('bootstraps the predefined secret with ciphertext before enabling registry settings', async () => {
    render(<GlobalPullSecretPage />)
    expect(screen.getByText(/globalPullSecret_password/)).toBeInTheDocument()
    await enterCredentials()
    submit()

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/settings/platform'))
    expect(mockEncrypt).toHaveBeenCalledWith('public-key', 'apl-secrets', 'registry-password')
    expect(mockCreate).toHaveBeenCalledWith({
      namespace: 'apl-secrets',
      body: {
        apiVersion: 'bitnami.com/v1alpha1',
        kind: 'SealedSecret',
        metadata: { name: 'otomi-secrets', namespace: 'apl-secrets' },
        spec: {
          template: { type: 'kubernetes.io/opaque' },
          encryptedData: { globalPullSecret_password: 'new-encrypted-password' },
        },
      },
    })
    expect(mockEditSettings).toHaveBeenCalledWith({
      settingId: 'otomi',
      body: {
        otomi: {
          version: 'v1',
          nodeSelector: [],
          globalPullSecret: { server: 'docker.io', username: 'registry-user' },
        },
      },
    })
    expect(mockCreate.mock.invocationCallOrder[0]).toBeLessThan(mockEditSettings.mock.invocationCallOrder[0])
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(JSON.stringify(mockCreate.mock.calls)).not.toContain('registry-password')
  })

  it('adds a missing password key without replacing other keys or template metadata', async () => {
    mockSecrets = [
      { ...existingSecret, spec: { ...existingSecret.spec, encryptedData: { adminPassword: 'encrypted-admin' } } },
    ]
    render(<GlobalPullSecretPage />)
    await enterCredentials()
    submit()

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        namespace: 'apl-secrets',
        sealedSecretName: 'otomi-secrets',
        body: expect.objectContaining({
          spec: {
            template: existingSecret.spec.template,
            encryptedData: { adminPassword: 'encrypted-admin', globalPullSecret_password: 'new-encrypted-password' },
          },
        }),
      }),
    )
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('does not expose existing ciphertext or send it through settings when editing registry details', async () => {
    const user = userEvent.setup()
    mockSecrets = [existingSecret]
    mockSettings.otomi.globalPullSecret = {
      server: 'docker.io',
      username: 'existing-user',
      password: 'old-encrypted-password',
    }
    mockSettings.otomi.git = { repoUrl: 'repo', branch: 'main', email: 'git@example.com', password: 'git-secret' }
    render(<GlobalPullSecretPage />)
    expect(screen.getByLabelText('New password (optional)')).toHaveValue('')
    expect(screen.queryByDisplayValue('old-encrypted-password')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View encrypted data in Platform Secrets' })).toHaveAttribute(
      'href',
      '/secrets/apl-secrets/otomi-secrets',
    )
    await user.clear(screen.getByLabelText('Username'))
    await user.type(screen.getByLabelText('Username'), 'updated-user')
    submit()

    await waitFor(() => expect(mockEditSettings).toHaveBeenCalledTimes(1))
    expect(mockEditSettings.mock.calls[0][0].body.otomi.globalPullSecret).toEqual({
      server: 'docker.io',
      username: 'updated-user',
    })
    expect(mockEditSettings.mock.calls[0][0].body.otomi).not.toHaveProperty('adminPassword')
    expect(mockEditSettings.mock.calls[0][0].body.otomi).not.toHaveProperty('git')
    expect(mockEncrypt).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('rotates a password while retaining unrelated encrypted data', async () => {
    mockSecrets = [existingSecret]
    mockSettings.otomi.globalPullSecret = { server: 'docker.io', username: 'existing-user' }
    render(<GlobalPullSecretPage />)
    await userEvent.type(screen.getByLabelText('New password (optional)'), 'new-password')
    submit()
    await waitFor(() => expect(mockPush).toHaveBeenCalled())
    expect(mockUpdate.mock.calls[0][0].body.spec.encryptedData).toEqual({
      adminPassword: 'encrypted-admin',
      globalPullSecret_password: 'new-encrypted-password',
    })
  })

  it('requires a password when only registry settings exist', async () => {
    mockSettings.otomi.globalPullSecret = { server: 'docker.io', username: 'existing-user' }
    render(<GlobalPullSecretPage />)
    submit()
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockEditSettings).not.toHaveBeenCalled()
  })

  it.each([
    ['Username', '', 'Username is required'],
    ['Registry server', '', 'Registry server is required'],
    ['Email (optional)', 'not-email', 'Enter a valid email address'],
  ])('validates %s', async (label, value, message) => {
    const user = userEvent.setup()
    render(<GlobalPullSecretPage />)
    await enterCredentials()
    await user.clear(screen.getByLabelText(label))
    if (value) await user.type(screen.getByLabelText(label), value)
    submit()
    expect(await screen.findByText(message)).toBeInTheDocument()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it.each(['missing-key', 'encryption-error', 'secret-save-error'])(
    'does not enable registry settings after %s',
    async (failure) => {
      if (failure === 'missing-key') mockPEM = ''
      if (failure === 'encryption-error') mockEncrypt.mockRejectedValue(new Error('encryption failed'))
      if (failure === 'secret-save-error')
        mockCreate.mockReturnValue({ unwrap: () => Promise.reject(new Error('save failed')) })
      render(<GlobalPullSecretPage />)
      await enterCredentials()
      submit()
      expect(await screen.findByText(/Unable to encrypt or save/)).toBeInTheDocument()
      expect(mockEditSettings).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
      expect(mockSuccess).not.toHaveBeenCalled()
      expect(mockCreate).toHaveBeenCalledTimes(failure === 'secret-save-error' ? 1 : 0)
    },
  )

  it('retries a partial save without recreating the secret or losing entered registry details', async () => {
    mockEditSettings
      .mockReturnValueOnce({ unwrap: () => Promise.reject(new Error('settings failed')) })
      .mockReturnValue({ unwrap: () => Promise.resolve() })
    render(<GlobalPullSecretPage />)
    await enterCredentials()
    submit()
    expect(await screen.findByText(/registry settings could not be saved/)).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
    expect(mockSuccess).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Username')).toHaveValue('registry-user')
    expect(screen.getByLabelText('New password (optional)')).toHaveValue('')
    submit()
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/settings/platform'))
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockEncrypt).toHaveBeenCalledTimes(1)
    expect(mockEditSettings).toHaveBeenCalledTimes(2)
  })

  it.each(['secrets', 'settings'])('blocks setup when loading %s fails', (failure) => {
    mockSecretsError = failure === 'secrets'
    mockSettingsError = failure === 'settings'
    render(<GlobalPullSecretPage />)
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load')
    expect(screen.queryByRole('button', { name: 'Create global pull secret' })).not.toBeInTheDocument()
  })

  it('blocks saving during refetch', () => {
    mockFetching = true
    render(<GlobalPullSecretPage />)
    expect(screen.getByRole('button', { name: 'Create global pull secret' })).toBeDisabled()
  })

  it('prevents adding a password to an immutable shared secret', () => {
    mockSecrets = [
      {
        ...existingSecret,
        spec: {
          encryptedData: { adminPassword: 'encrypted-admin' },
          template: { ...existingSecret.spec.template, immutable: true },
        },
      },
    ]
    render(<GlobalPullSecretPage />)
    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Create global pull secret' })).toBeDisabled()
    expect(screen.getByText(/platform secret is immutable/)).toBeInTheDocument()
  })

  it('disables the global pull secret without modifying or deleting the shared secret', async () => {
    mockSecrets = [existingSecret]
    mockSettings.otomi.globalPullSecret = { server: 'docker.io', username: 'existing-user' }
    render(<GlobalPullSecretPage />)
    await userEvent.click(screen.getByRole('button', { name: 'Disable global pull secret' }))
    await waitFor(() => expect(mockPush).toHaveBeenCalled())
    expect(mockEditSettings.mock.calls[0][0].body.otomi.globalPullSecret).toBeNull()
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('does not treat a retained password without registry metadata as enabled settings', () => {
    mockSecrets = [existingSecret]
    mockSettings.otomi.globalPullSecret = { password: 'old-encrypted-password' }
    render(<GlobalPullSecretPage />)
    expect(screen.queryByRole('button', { name: 'Disable global pull secret' })).not.toBeInTheDocument()
  })
})
