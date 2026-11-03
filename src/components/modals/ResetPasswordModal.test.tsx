import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import palette from 'theme/palette'
import ResetPasswordModal from './ResetPasswordModal'

const mockDispatch = jest.fn()
const mockResetPassword = jest.fn()
const mockUseResetPasswordMutation = jest.fn()
const mockSnackSuccess = jest.fn()

jest.mock('redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('redux/reducers', () => ({
  modalOpened: () => ({ type: 'global/modalOpened' }),
  modalClosed: () => ({ type: 'global/modalClosed' }),
}))

jest.mock('redux/otomiApi', () => ({
  useResetPasswordMutation: () => mockUseResetPasswordMutation(),
}))

jest.mock('utils/snack', () => ({
  __esModule: true,
  default: { success: (msg: string) => mockSnackSuccess(msg) },
}))

jest.mock(
  'components/InformationBanner',
  () =>
    function MockInformationBanner({ message }: any) {
      return <div data-testid='error-banner'>{message}</div>
    },
)

const theme = createTheme({ palette: palette.light })
theme.font = { normal: 'sans-serif', bold: 'sans-serif' }

function renderModal(props: Partial<{ open: boolean; onClose: () => void }> = {}) {
  const onClose = props.onClose ?? jest.fn()
  render(
    <ThemeProvider theme={theme}>
      <ResetPasswordModal open={props.open ?? true} onClose={onClose} />
    </ThemeProvider>,
  )
  return { onClose }
}

function fillForm(oldPassword: string, newPassword: string, confirmPassword: string) {
  fireEvent.change(screen.getByLabelText('Old password'), { target: { value: oldPassword } })
  fireEvent.change(screen.getByLabelText('New password'), { target: { value: newPassword } })
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: confirmPassword } })
}

describe('ResetPasswordModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseResetPasswordMutation.mockReturnValue([mockResetPassword, { isLoading: false }])
    mockResetPassword.mockResolvedValue({ data: undefined })
  })

  it('renders the password fields', () => {
    renderModal()

    expect(screen.getByText('Reset Password')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Reset Password' })).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByLabelText('Old password')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('New password')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Confirm password')).toHaveAttribute('type', 'password')
  })

  it('shows validation errors and does not submit an empty form', async () => {
    renderModal()

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(await screen.findByText('Old password is required')).toBeInTheDocument()
    expect(screen.getByText('New password is required')).toBeInTheDocument()
    expect(screen.getByText('Please confirm your new password')).toBeInTheDocument()
    expect(mockResetPassword).not.toHaveBeenCalled()
  })

  it('validates that passwords match', async () => {
    renderModal()

    fillForm('oldpassword', 'newpassword1', 'newpassword2')
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
    expect(mockResetPassword).not.toHaveBeenCalled()
  })

  it('submits and closes on success', async () => {
    const { onClose } = renderModal()

    fillForm('oldpassword', 'newpassword1', 'newpassword1')
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    await waitFor(() =>
      expect(mockResetPassword).toHaveBeenCalledWith({
        body: { currentPassword: 'oldpassword', newPassword: 'newpassword1' },
      }),
    )
    expect(mockSnackSuccess).toHaveBeenCalledWith('Password reset successfully')
    expect(onClose).toHaveBeenCalled()
  })

  it('shows an error banner when the request fails', async () => {
    mockResetPassword.mockResolvedValue({ error: { status: 400, data: { message: 'Old password is incorrect' } } })
    const { onClose } = renderModal()

    fillForm('oldpassword', 'newpassword1', 'newpassword1')
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(await screen.findByTestId('error-banner')).toHaveTextContent('Old password is incorrect')
    expect(onClose).not.toHaveBeenCalled()
    expect(mockSnackSuccess).not.toHaveBeenCalled()
  })

  it.each([
    [401, 'Current password is incorrect.'],
    [403, 'Self-service password reset is only available when AUTH_PROVIDER is dex.'],
  ])('keeps API rejection %s in the modal without reporting success', async (statusCode, message) => {
    mockResetPassword.mockResolvedValue({ data: { statusCode, message } })
    const { onClose } = renderModal()

    fillForm('oldpassword', 'newpassword1', 'newpassword1')
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(await screen.findByTestId('error-banner')).toHaveTextContent(message)
    expect(onClose).not.toHaveBeenCalled()
    expect(mockSnackSuccess).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Old password')).toHaveValue('oldpassword')
  })

  it('calls onClose when cancel is clicked', () => {
    const { onClose } = renderModal()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onClose).toHaveBeenCalled()
  })
})
