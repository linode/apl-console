import { ThemeProvider, createTheme } from '@mui/material/styles'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SessionContext } from 'providers/Session'
import { MemoryRouter } from 'react-router-dom'
import palette from 'theme/palette'
import AccountPopover from './AccountPopover'

const mockUseSession = jest.fn()
const mockDeleteCloudtty = jest.fn()

jest.mock('providers/Session', () => ({
  useSession: () => mockUseSession(),
}))

jest.mock('redux/otomiApi', () => ({
  useDeleteCloudttyMutation: () => [mockDeleteCloudtty],
}))

jest.mock('./SettingMode', () => () => null)

jest.mock('./modals/ResetPasswordModal', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div role='dialog' aria-label='Reset Password'>
        <button type='button' onClick={onClose}>
          Cancel
        </button>
      </div>
    ) : null,
}))

const theme = createTheme({ palette: palette.light })
theme.font = { normal: 'sans-serif', bold: 'sans-serif' }

function renderPopover(settings: SessionContext['settings']) {
  mockUseSession.mockReturnValue({ oboTeamId: 'team-one', settings })
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AccountPopover email='user@example.com' />
      </ThemeProvider>
    </MemoryRouter>,
  )
  fireEvent.click(screen.getByRole('button'))
}

describe('AccountPopover', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDeleteCloudtty.mockResolvedValue({})
  })

  it('hides self-service password reset for Keycloak', () => {
    renderPopover({ otomi: { oidc: { authenticationLayer: 'keycloak' } } })

    expect(screen.queryByText('Reset password')).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Reset Password' })).not.toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument()
  })

  it('opens and closes self-service password reset for Dex', async () => {
    renderPopover({ otomi: { oidc: { authenticationLayer: 'dex' } } })

    fireEvent.click(screen.getByRole('menuitem', { name: 'Reset password' }))
    expect(screen.getByRole('dialog', { name: 'Reset Password' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Reset Password' })).not.toBeInTheDocument())
  })

  it.each([undefined, {}, { otomi: {} }, { otomi: { oidc: {} } }])(
    'hides self-service password reset when the authentication layer is unknown (%j)',
    (settings) => {
      renderPopover(settings)

      expect(screen.queryByText('Reset password')).not.toBeInTheDocument()
    },
  )

  it.each(['dex', 'keycloak'] as const)('preserves sign out for %s', async (authenticationLayer) => {
    renderPopover({ otomi: { oidc: { authenticationLayer } } })

    fireEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }))

    await waitFor(() => expect(mockDeleteCloudtty).toHaveBeenCalledWith({ teamId: 'team-one' }))
  })
})
