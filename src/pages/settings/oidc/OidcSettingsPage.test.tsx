import { fireEvent, screen } from '@testing-library/react'
import { change, mockEdit, renderSettingsPage, resetSettingsMocks, save } from '../settings-test-utils'
import OidcSettingsPage from './OidcSettingsPage'

beforeEach(() =>
  resetSettingsMocks({
    oidc: {
      issuer: 'https://old.example.com',
      clientID: 'client',
      clientSecret: 'secret',
      platformAdminGroupID: 'admins',
    },
  }),
)

test('edits OIDC settings while keeping credentials masked and claim defaults', async () => {
  renderSettingsPage(OidcSettingsPage)
  expect(screen.getByLabelText('Client secret')).toHaveAttribute('type', 'password')
  change('Issuer', 'https://new.example.com')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({
    settingId: 'oidc',
    body: {
      oidc: {
        issuer: 'https://new.example.com',
        clientID: 'client',
        clientSecret: 'secret',
        platformAdminGroupID: 'admins',
        // eslint-disable-next-line no-template-curly-in-string
        usernameClaimMapper: '${CLAIM.upn}',
        subClaimMapper: 'sub',
      },
    },
  })
})

test('requires credentials and a valid issuer', async () => {
  renderSettingsPage(OidcSettingsPage)
  change('Issuer', 'invalid')
  change('Client ID', '')
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
  expect(await screen.findAllByRole('alert')).toHaveLength(2)
  expect(mockEdit).not.toHaveBeenCalled()
})
