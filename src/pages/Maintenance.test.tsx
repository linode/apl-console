import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ReactNode } from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import ObjAppModal from 'components/ObjAppModal'
import { useSession } from 'providers/Session'
import { useCreateObjWizardMutation, useGetSettingsQuery } from 'redux/otomiApi'
import palette from 'theme/palette'
import Maintenance from './Maintenance'

jest.mock('providers/Session', () => ({
  useSession: jest.fn(),
}))

jest.mock('redux/otomiApi', () => ({
  useCreateObjWizardMutation: jest.fn(),
  useGetSettingsQuery: jest.fn(),
}))

jest.mock(
  'layouts/Paper',
  () =>
    function ({ comp }: { comp: ReactNode }) {
      return <div>{comp}</div>
    },
)

jest.mock('components/HeaderTitle', () => () => null)
jest.mock(
  'components/Section',
  () =>
    function ({ children }: { children: ReactNode }) {
      return <div>{children}</div>
    },
)

const theme = createTheme({
  palette: palette.light,
  font: { normal: 'sans-serif' },
})

function renderMaintenance() {
  return render(
    <ThemeProvider theme={theme}>
      <Maintenance />
    </ThemeProvider>,
  )
}

describe('Maintenance Object Storage wizard', () => {
  const create = jest.fn()
  const reload = jest.fn()
  const originalLocation = window.location

  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, reload },
      configurable: true,
    })
    ;(useSession as jest.Mock).mockReturnValue({
      user: { isPlatformAdmin: true },
      settings: { otomi: {} },
      objectStorage: {
        showWizard: false,
        objStorageRegions: [{ id: 'us-east', label: 'Newark' }],
      },
    })
    ;(useGetSettingsQuery as jest.Mock).mockReturnValue({ data: { obj: {} } })
    ;(useCreateObjWizardMutation as jest.Mock).mockReturnValue([create])
  })

  afterEach(() => {
    localStorage.clear()
    Object.defineProperty(window, 'location', { value: originalLocation })
  })

  it.each([undefined, false, true])('starts the wizard with isPreInstalled=%s', (isPreInstalled) => {
    ;(useSession as jest.Mock).mockReturnValue({
      ...useSession(),
      settings: { otomi: { isPreInstalled } },
    })
    const { unmount } = renderMaintenance()

    fireEvent.click(screen.getByRole('button', { name: 'Start Object Storage Wizard' }))

    expect(localStorage.getItem('showObjWizard')).toBe('true')
    expect(reload).toHaveBeenCalledTimes(1)

    unmount()
    renderMaintenance()

    expect(screen.getByText('Would you like to configure object storage now?')).toBeInTheDocument()
    expect(localStorage.getItem('showObjWizard')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))

    expect(screen.getByRole('textbox', { name: /API Token/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'How to create an API token?' })).toHaveAttribute(
      'href',
      'https://techdocs.akamai.com/app-platform/docs/lke-automatic-install#provision-object-storage-for-app-platform',
    )
  })

  it.each([false, true])('opens the wizard from an app prompt with required=%s', (required) => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/apps']}>
          <Route path='/apps'>
            <ObjAppModal open handleClose={jest.fn()} appId='loki' required={required} />
          </Route>
          <Route path='/maintenance'>
            <Maintenance />
          </Route>
        </MemoryRouter>
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Start Object Storage Wizard' }))

    expect(screen.getByText('Would you like to configure object storage now?')).toBeInTheDocument()
    expect(localStorage.getItem('showObjWizard')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }))

    expect(create).toHaveBeenCalledWith({ body: { showWizard: false } })
    expect(screen.queryByText('Would you like to configure object storage now?')).not.toBeInTheDocument()
    expect(localStorage.getItem('showObjWizard')).toBe('false')
  })

  it('keeps the action disabled when Object Storage is already configured', () => {
    ;(useGetSettingsQuery as jest.Mock).mockReturnValue({
      data: {
        obj: {
          provider: {
            type: 'linode',
            linode: { accessKeyId: 'access-key', secretAccessKey: 'secret-key', region: 'us-east' },
          },
        },
      },
    })

    renderMaintenance()

    expect(screen.getByRole('button', { name: 'Start Object Storage Wizard' })).toBeDisabled()
  })

  it('does not render the wizard for users who are not platform admins', () => {
    localStorage.setItem('showObjWizard', 'true')
    ;(useSession as jest.Mock).mockReturnValue({
      ...useSession(),
      user: { isPlatformAdmin: false },
    })

    renderMaintenance()

    expect(screen.queryByText('Would you like to configure object storage now?')).not.toBeInTheDocument()
  })
})
