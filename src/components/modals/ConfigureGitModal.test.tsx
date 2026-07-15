import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import * as mockReact from 'react'
import ConfigureGitModal from './ConfigureGitModal'

const mockUseSession = jest.fn()
const mockUseLocalStorage = jest.fn()
const mockUseGetGitSettingsQuery = jest.fn()
const mockUseMigrateGitMutation = jest.fn()
const mockDispatch = jest.fn()
const mockSetShowGitWizard = jest.fn()
const mockMigrateGit = jest.fn()
const mockWriteText = jest.fn()

const mockModalOpened = jest.fn()
const mockModalClosed = jest.fn()

const mockModalOpenedAction = {
  type: 'global/modalOpened',
  payload: undefined,
}

const mockModalClosedAction = {
  type: 'global/modalClosed',
  payload: undefined,
}

jest.mock('providers/Session', () => ({
  useSession: () => mockUseSession(),
}))

jest.mock('react-use', () => ({
  useLocalStorage: (...args: any[]) => mockUseLocalStorage(...args),
}))

jest.mock('redux/otomiApi', () => ({
  useGetGitSettingsQuery: (...args: any[]) => mockUseGetGitSettingsQuery(...args),
  useMigrateGitMutation: () => mockUseMigrateGitMutation(),
}))

jest.mock('redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('redux/reducers', () => ({
  modalOpened: () => mockModalOpened(),
  modalClosed: () => mockModalClosed(),
}))

jest.mock(
  'components/InformationBanner',
  () =>
    function MockInformationBanner({ message, type }: any) {
      return <div data-testid={type === 'error' ? 'error-banner' : 'info-banner'}>{message}</div>
    },
)

jest.mock('components/forms/TextField', () => ({
  TextField: mockReact.forwardRef(({ label, value, onChange, helperText, error, type }: any, ref: any) => {
    const inputId = `mock-${label.replace(/\s+/g, '-').toLowerCase()}`

    return (
      <div>
        <label htmlFor={inputId}>{label}</label>
        <input
          id={inputId}
          ref={ref}
          aria-label={label}
          value={value || ''}
          onChange={onChange}
          type={type || 'text'}
        />
        {error && helperText && <span>{helperText}</span>}
      </div>
    )
  }),
}))

const theme = createTheme({
  palette: {
    cm: {
      rowAlter: '#111',
    },
  } as any,
})

function renderModal(props = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <ConfigureGitModal {...props} />
    </ThemeProvider>,
  )
}

describe('ConfigureGitModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()

    mockModalOpened.mockReturnValue(mockModalOpenedAction)
    mockModalClosed.mockReturnValue(mockModalClosedAction)

    mockUseSession.mockReturnValue({
      user: {
        isPlatformAdmin: true,
      },
      settings: {
        cluster: {
          domainSuffix: 'example.com',
        },
      },
    })

    mockUseLocalStorage.mockReturnValue([true, mockSetShowGitWizard])

    mockUseGetGitSettingsQuery.mockReturnValue({
      data: {
        repoUrl: 'http://git-server.git-server.svc.cluster.local/otomi/values.git',
        branch: 'main',
        username: '',
        email: '',
      },
      isFetching: false,
    })

    mockUseMigrateGitMutation.mockReturnValue([
      mockMigrateGit,
      {
        isLoading: false,
      },
    ])

    mockMigrateGit.mockResolvedValue({
      data: {
        message: 'ok',
      },
    })

    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })
  })

  it('does not render for non-platform admins', () => {
    mockUseSession.mockReturnValue({
      user: {
        isPlatformAdmin: false,
      },
      settings: {
        cluster: {
          domainSuffix: 'example.com',
        },
      },
    })

    renderModal({ open: true })

    expect(screen.queryByText('Configure Git Repository')).toBeNull()
  })

  it('skips fetching Git settings when the modal is closed', () => {
    renderModal({ open: false })

    expect(mockUseGetGitSettingsQuery).toHaveBeenCalledWith(undefined, {
      skip: true,
    })
  })

  it('fetches Git settings when opened by a platform admin', () => {
    renderModal({ open: true })

    expect(mockUseGetGitSettingsQuery).toHaveBeenCalledWith(undefined, {
      skip: false,
    })
  })

  it('shows the loading state while Git settings are fetching', () => {
    mockUseGetGitSettingsQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    })

    renderModal({ open: true })

    expect(screen.getByText('Loading Git settings...')).toBeTruthy()
  })

  it('shows the intro step for default internal Git configuration', () => {
    renderModal({ open: true })

    expect(screen.getByText('Configure Git Repository')).toBeTruthy()
    expect(screen.getByText('App Platform is installed on a light weight Git server.')).toBeTruthy()
    expect(screen.getByText('https://git.example.com/otomi/values')).toBeTruthy()
    expect(screen.getByText('Configure later')).toBeTruthy()
    expect(screen.getByText('Proceed')).toBeTruthy()
  })

  it('copies the displayed default Git URL', () => {
    renderModal({ open: true })

    fireEvent.click(screen.getByLabelText('Copy Git repository URL'))

    expect(mockWriteText).toHaveBeenCalledWith('https://git.example.com/otomi/values')
  })

  it('opens the form step after clicking proceed', () => {
    jest.useFakeTimers()

    renderModal({ open: true })

    fireEvent.click(screen.getByText('Proceed'))

    act(() => {
      jest.advanceTimersByTime(180)
    })

    expect(screen.getByLabelText('Git Repo url')).toBeTruthy()
    expect(screen.getByLabelText('Branch')).toBeTruthy()
    expect(screen.getByLabelText('Username (Optional)')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
  })

  it('starts on the form step when an external Git configuration already exists', () => {
    mockUseGetGitSettingsQuery.mockReturnValue({
      data: {
        repoUrl: 'https://github.com/example/values.git',
        branch: 'main',
        username: 'git-user',
        email: 'git@example.com',
      },
      isFetching: false,
    })

    renderModal({ open: true })

    expect(screen.getByLabelText('Git Repo url')).toBeTruthy()
    expect(screen.getByDisplayValue('https://github.com/example/values.git')).toBeTruthy()
    expect(screen.getByTestId('info-banner')).toBeTruthy()
  })

  it('submits the migration form and shows success', async () => {
    jest.useFakeTimers()

    renderModal({ open: true })

    fireEvent.click(screen.getByText('Proceed'))

    act(() => {
      jest.advanceTimersByTime(180)
    })

    fireEvent.change(screen.getByLabelText('Git Repo url'), {
      target: { value: 'https://github.com/example/values.git' },
    })
    fireEvent.change(screen.getByLabelText('Branch'), {
      target: { value: 'main' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'git@example.com' },
    })

    fireEvent.click(screen.getByText('Proceed'))

    await waitFor(() => {
      expect(mockMigrateGit).toHaveBeenCalledWith({
        body: {
          repoUrl: 'https://github.com/example/values.git',
          branch: 'main',
          username: undefined,
          password: 'secret',
          email: 'git@example.com',
        },
      })
    })

    expect(await screen.findByText('Successfully connected to Git repository')).toBeTruthy()
  })

  it('shows an error banner when migration fails', async () => {
    jest.useFakeTimers()

    mockMigrateGit.mockResolvedValue({
      error: {
        status: 400,
      },
    })

    renderModal({ open: true })

    fireEvent.click(screen.getByText('Proceed'))

    act(() => {
      jest.advanceTimersByTime(180)
    })

    fireEvent.change(screen.getByLabelText('Git Repo url'), {
      target: { value: 'https://github.com/example/values.git' },
    })
    fireEvent.change(screen.getByLabelText('Branch'), {
      target: { value: 'main' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'git@example.com' },
    })

    fireEvent.click(screen.getByText('Proceed'))

    expect(
      await screen.findByText(
        'Cannot connect to the provided Git repository. Check the repository URL and credentials.',
      ),
    ).toBeTruthy()

    expect(screen.getByTestId('error-banner')).toBeTruthy()
  })

  it('closes uncontrolled modal by hiding the wizard when Configure later is clicked', () => {
    renderModal()

    fireEvent.click(screen.getByText('Configure later'))

    expect(mockSetShowGitWizard).toHaveBeenCalledWith(false)
  })

  it('calls onClose when controlled modal is closed with Configure later', () => {
    const onClose = jest.fn()

    renderModal({ open: true, onClose })

    fireEvent.click(screen.getByText('Configure later'))

    expect(onClose).toHaveBeenCalled()
    expect(mockSetShowGitWizard).not.toHaveBeenCalledWith(false)
  })

  it('dispatches modalOpened while open and modalClosed on unmount', () => {
    const { unmount } = renderModal({ open: true })

    expect(mockModalOpened).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith(mockModalOpenedAction)

    unmount()

    expect(mockModalClosed).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith(mockModalClosedAction)
  })
})
