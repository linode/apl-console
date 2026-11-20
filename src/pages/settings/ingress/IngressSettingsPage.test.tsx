import { fireEvent, screen, within } from '@testing-library/react'
import { change, mockEdit, mockSession, renderSettingsPage, resetSettingsMocks, save } from '../settings-test-utils'
import IngressSettingsPage from './IngressSettingsPage'

beforeEach(() =>
  resetSettingsMocks({ ingress: { platformClass: { className: 'platform', entrypoint: '1.2.3.4' }, classes: [] } }),
)

test('edits ingress classes and annotations without exposing the platform class name', async () => {
  renderSettingsPage(IngressSettingsPage)
  expect(screen.queryByLabelText('Class name')).not.toBeInTheDocument()
  change('Entrypoint', '5.6.7.8')
  const platform = screen.getByRole('region', { name: 'Platform ingress class' })
  fireEvent.click(within(platform).getByRole('button', { name: 'Add annotation' }))
  change('Annotation key 1', 'load-balancer')
  change('Annotation value 1', 'value')
  fireEvent.click(screen.getByRole('button', { name: 'Add class' }))
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
  expect(await screen.findByRole('alert')).toHaveTextContent("must have required property 'className'")
  change('Class name 1', 'external')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({
    settingId: 'ingress',
    body: {
      ingress: {
        platformClass: {
          className: 'platform',
          entrypoint: '5.6.7.8',
          annotations: [{ key: 'load-balancer', value: 'value' }],
        },
        classes: [{ className: 'external', annotations: [] }],
      },
    },
  })
})

test('supports removing additional classes and annotations', async () => {
  resetSettingsMocks({
    ingress: {
      platformClass: { className: 'platform', annotations: [{ key: 'old', value: 'old' }] },
      classes: [{ className: 'external' }],
    },
  })
  renderSettingsPage(IngressSettingsPage)
  fireEvent.click(screen.getByRole('button', { name: 'Remove class 1' }))
  fireEvent.click(screen.getByRole('button', { name: 'Remove annotation 1' }))
  await save()
  expect(mockEdit.mock.calls[0][0].body.ingress).toEqual({
    platformClass: { className: 'platform', annotations: [] },
    classes: [],
  })
})

test('additional classes require external DNS, while platform ingress remains editable', async () => {
  mockSession.settings.otomi.hasExternalDNS = false
  renderSettingsPage(IngressSettingsPage)
  expect(screen.getByRole('button', { name: 'Add class' })).toBeDisabled()
  change('Entrypoint', '5.6.7.8')
  await save()
  expect(mockEdit.mock.calls[0][0].body.ingress.platformClass.entrypoint).toBe('5.6.7.8')
})

test('preinstalled ingress settings cannot be changed', () => {
  mockSession.settings.otomi.isPreInstalled = true
  renderSettingsPage(IngressSettingsPage)
  expect(screen.getByLabelText('Entrypoint')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
})
