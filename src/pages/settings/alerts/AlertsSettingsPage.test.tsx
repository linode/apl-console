import { fireEvent, screen } from '@testing-library/react'
import { change, mockEdit, mockSession, renderSettingsPage, resetSettingsMocks, save } from '../settings-test-utils'
import AlertsSettingsPage from './AlertsSettingsPage'

beforeEach(() =>
  resetSettingsMocks({
    alerts: {
      repeatInterval: '3h',
      groupInterval: '5m',
      receivers: ['slack'],
      slack: { channel: 'general', channelCrit: 'critical', url: 'secret' },
      msteams: { highPrio: 'keep', lowPrio: 'keep-low' },
    },
  }),
)

test('shows selected receivers, masks secrets and preserves unselected receiver values', async () => {
  renderSettingsPage(AlertsSettingsPage)
  expect(screen.getByLabelText('Slack webhook URL')).toHaveAttribute('type', 'password')
  expect(screen.queryByLabelText('High priority webhook')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('checkbox', { name: 'Microsoft Teams' }))
  expect(screen.getByLabelText('High priority webhook')).toHaveValue('keep')
  fireEvent.click(screen.getByRole('checkbox', { name: 'Slack' }))
  change('High priority webhook', 'new')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({
    settingId: 'alerts',
    body: {
      alerts: {
        repeatInterval: '3h',
        groupInterval: '5m',
        receivers: ['msteams'],
        slack: { channel: 'general', channelCrit: 'critical', url: 'secret' },
        msteams: { highPrio: 'new', lowPrio: 'keep-low' },
      },
    },
  })
})

test('retains the Alertmanager warning', () => {
  mockSession.appsEnabled.alertmanager = false
  renderSettingsPage(AlertsSettingsPage)
  expect(screen.getByText('Please enable Alertmanager to activate Alerts settings')).toBeInTheDocument()
})

test('receiver choices support adding Slack, selecting None and clearing selections', async () => {
  resetSettingsMocks({ alerts: { receivers: [] } })
  renderSettingsPage(AlertsSettingsPage)
  fireEvent.click(screen.getByRole('checkbox', { name: 'Slack' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Microsoft Teams' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'Microsoft Teams' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'None' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'None' }))
  await save()
  expect(mockEdit.mock.calls[0][0].body.alerts.receivers).toEqual(['slack'])
})
