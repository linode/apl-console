import { fireEvent, screen } from '@testing-library/react'
import { change, mockEdit, mockSession, renderSettingsPage, resetSettingsMocks, save } from '../settings-test-utils'
import KmsSettingsPage from './KmsSettingsPage'

beforeEach(() =>
  resetSettingsMocks({ kms: { sops: { provider: 'age', age: { publicKey: 'public', privateKey: 'private' } } } }),
)

test('protects generated Age keys and allows disabling encryption', async () => {
  renderSettingsPage(KmsSettingsPage)
  expect(screen.getByLabelText('Public key')).toBeDisabled()
  expect(screen.getByLabelText('Private key')).toBeDisabled()
  expect(screen.getByLabelText('Private key')).toHaveAttribute('type', 'password')
  change('SOPS provider', '')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({ settingId: 'kms', body: { kms: { sops: null } } })
})

test.each([
  [
    'aws',
    ['AWS KMS keys', 'Access key', 'Secret key'],
    { provider: 'aws', aws: { keys: 'key', accessKey: 'key', secretKey: 'key' } },
  ],
  [
    'azure',
    ['Azure Keyvault keys', 'Client ID', 'Client secret'],
    { provider: 'azure', azure: { keys: 'key', clientId: 'key', clientSecret: 'key' } },
  ],
  [
    'google',
    ['Google KMS keys', 'Service account JSON', 'Project'],
    { provider: 'google', google: { keys: 'key', accountJson: 'key', project: 'key' } },
  ],
])(
  'switches to %s and submits only the selected provider',
  async (provider: string, labels: string[], expected: object) => {
    renderSettingsPage(KmsSettingsPage)
    change('SOPS provider', provider)
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
    expect(await screen.findAllByRole('alert')).toHaveLength(3)
    expect(mockEdit).not.toHaveBeenCalled()
    labels.forEach((label) => change(label, 'key'))
    await save()
    expect(mockEdit).toHaveBeenCalledWith({ settingId: 'kms', body: { kms: { sops: expected } } })
  },
)

test('preinstalled secrets cannot be modified', () => {
  mockSession.settings.otomi.isPreInstalled = true
  renderSettingsPage(KmsSettingsPage)
  expect(screen.getByLabelText('SOPS provider')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
})

test.each([
  ['aws', 'Access key'],
  ['azure', 'Client ID'],
])('%s credentials retain their secret masking', (provider, label) => {
  renderSettingsPage(KmsSettingsPage)
  change('SOPS provider', provider)
  expect(screen.getByLabelText(label)).toHaveAttribute('type', 'password')
})
