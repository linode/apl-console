import { fireEvent, screen } from '@testing-library/react'
import { change, mockEdit, renderSettingsPage, resetSettingsMocks, save } from '../settings-test-utils'
import ObjectStorageSettingsPage from './ObjectStorageSettingsPage'

beforeEach(() => resetSettingsMocks({ obj: { showWizard: false, provider: { type: 'disabled' } } }))

test('enables Linode storage with required credentials and default buckets, preserving the hidden wizard flag', async () => {
  renderSettingsPage(ObjectStorageSettingsPage)
  change('Provider', 'linode')
  expect(screen.getByLabelText('Secret access key')).toHaveAttribute('type', 'password')
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
  expect(await screen.findAllByRole('alert')).toHaveLength(3)
  expect(mockEdit).not.toHaveBeenCalled()
  change('Region', 'us-east-1')
  change('Access key ID', 'access')
  change('Secret access key', 'secret')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({
    settingId: 'obj',
    body: {
      obj: {
        showWizard: false,
        provider: {
          type: 'linode',
          linode: {
            region: 'us-east-1',
            accessKeyId: 'access',
            secretAccessKey: 'secret',
            buckets: {
              loki: 'loki',
              cnpg: 'cnpg',
              harbor: 'harbor',
              gitea: 'gitea',
              'kubeflow-pipelines': 'kubeflow-pipelines',
            },
          },
        },
      },
    },
  })
})

test('disabling storage removes stale provider credentials', async () => {
  resetSettingsMocks({
    obj: {
      showWizard: false,
      provider: { type: 'linode', linode: { region: 'us-east-1', accessKeyId: 'access', secretAccessKey: 'secret' } },
    },
  })
  renderSettingsPage(ObjectStorageSettingsPage)
  change('Provider', 'disabled')
  expect(screen.queryByLabelText('Secret access key')).not.toBeInTheDocument()
  await save()
  expect(mockEdit).toHaveBeenCalledWith({
    settingId: 'obj',
    body: { obj: { showWizard: false, provider: { type: 'disabled' } } },
  })
})
