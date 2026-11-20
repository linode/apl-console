import { fireEvent, screen, within } from '@testing-library/react'
import { mockEdit, mockPush, mockSession, renderSettingsPage, resetSettingsMocks, save } from '../settings-test-utils'
import BackupSettingsPage from './BackupSettingsPage'

beforeEach(() => resetSettingsMocks({ platformBackups: { database: { keycloak: { enabled: false } } } }))

test('saves backup settings with existing schedule and retention defaults', async () => {
  renderSettingsPage(BackupSettingsPage)
  const keycloak = screen.getByRole('region', { name: 'Keycloak database' })
  fireEvent.click(within(keycloak).getByLabelText('Enabled'))
  await save()
  expect(mockEdit.mock.calls[0][0].body.platformBackups.database.keycloak).toEqual({
    enabled: true,
    schedule: '0 0 * * *',
    retentionPolicy: '7d',
  })
})

test('unavailable applications remain disabled', () => {
  mockSession.appsEnabled.harbor = false
  mockSession.appsEnabled.gitea = false
  renderSettingsPage(BackupSettingsPage)
  expect(within(screen.getByRole('region', { name: 'Harbor database' })).getByLabelText('Enabled')).toBeDisabled()
  expect(within(screen.getByRole('region', { name: 'Gitea database' })).getByLabelText('Schedule')).toBeDisabled()
  expect(within(screen.getByRole('region', { name: 'Gitea repositories' })).getByLabelText('Enabled')).toBeDisabled()
  expect(within(screen.getByRole('region', { name: 'Keycloak database' })).getByLabelText('Enabled')).toBeEnabled()
})

test.each([
  ['Keycloak database', 'Database backup requires object storage to be enabled.'],
  ['Gitea repositories', 'Gitea backup requires object storage to be enabled.'],
])('preinstalled %s requires storage and offers the object storage wizard', (section, message) => {
  mockSession.settings.otomi.isPreInstalled = true
  renderSettingsPage(BackupSettingsPage)
  const enabled = within(screen.getByRole('region', { name: section })).getByLabelText('Enabled')
  fireEvent.click(enabled)
  expect(screen.getByText(message)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Start Object Storage Wizard' }))
  expect(mockPush).toHaveBeenCalledWith('/maintenance')
  expect(localStorage.getItem('showObjWizard')).toBe('true')
  fireEvent.click(enabled)
  expect(screen.queryByText(message)).not.toBeInTheDocument()
})

test('configured object storage allows preinstalled backups', async () => {
  resetSettingsMocks({
    platformBackups: { database: { keycloak: { enabled: false } } },
    obj: {
      provider: {
        type: 'linode',
        linode: {
          region: 'us-east-1',
          accessKeyId: 'access',
          secretAccessKey: 'secret',
          buckets: { cnpg: 'database' },
        },
      },
    },
  })
  mockSession.settings.otomi.isPreInstalled = true
  renderSettingsPage(BackupSettingsPage)
  fireEvent.click(within(screen.getByRole('region', { name: 'Keycloak database' })).getByLabelText('Enabled'))
  expect(screen.queryByRole('button', { name: 'Start Object Storage Wizard' })).not.toBeInTheDocument()
  await save()
  expect(mockEdit).toHaveBeenCalled()
})
