import { screen } from '@testing-library/react'
import { change, mockEdit, renderSettingsPage, resetSettingsMocks, save } from '../settings-test-utils'
import VersionsSettingsPage from './VersionsSettingsPage'

beforeEach(() => resetSettingsMocks({}))

test('supports the legacy versions route with API defaults and static fields', async () => {
  renderSettingsPage(VersionsSettingsPage)
  expect(screen.getByLabelText('Version')).toHaveValue('latest')
  change('Version', 'v5.0.0')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({ settingId: 'versions', body: { versions: { version: 'v5.0.0' } } })
})
