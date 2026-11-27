import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ReactNode } from 'react'
import { MemoryRouter, Route } from 'react-router-dom'
import ObjAppModal from 'components/ObjAppModal'
import { useSession } from 'providers/Session'
import {
  useCreateObjWizardMutation,
  useDeleteGiteaUsersMutation,
  useGetSettingsQuery,
  useImportKeycloakUsersMutation,
} from 'redux/otomiApi'
import palette from 'theme/palette'
import Maintenance from './Maintenance'

jest.mock('providers/Session', () => ({
  useSession: jest.fn(),
}))

jest.mock('redux/otomiApi', () => ({
  useCreateObjWizardMutation: jest.fn(),
  useGetSettingsQuery: jest.fn(),
  useImportKeycloakUsersMutation: jest.fn(),
  useDeleteGiteaUsersMutation: jest.fn(),
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
    ;(useImportKeycloakUsersMutation as jest.Mock).mockReturnValue([jest.fn(), { reset: jest.fn() }])
    ;(useDeleteGiteaUsersMutation as jest.Mock).mockReturnValue([jest.fn(), { reset: jest.fn() }])
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

describe('Maintenance Keycloak user import', () => {
  const importKeycloakUsers = jest.fn()

  function mockSession(authenticationLayer: string, keycloakEnabled: boolean) {
    ;(useSession as jest.Mock).mockReturnValue({
      user: { isPlatformAdmin: true },
      appsEnabled: { keycloak: keycloakEnabled },
      settings: { otomi: { oidc: { authenticationLayer } } },
      objectStorage: { showWizard: false, objStorageRegions: [] },
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useGetSettingsQuery as jest.Mock).mockReturnValue({ data: { obj: {} } })
    ;(useCreateObjWizardMutation as jest.Mock).mockReturnValue([jest.fn()])
    importKeycloakUsers.mockReturnValue({ unwrap: () => Promise.resolve() })
    ;(useImportKeycloakUsersMutation as jest.Mock).mockReturnValue([importKeycloakUsers, { reset: jest.fn() }])
    ;(useDeleteGiteaUsersMutation as jest.Mock).mockReturnValue([jest.fn(), { reset: jest.fn() }])
  })

  it.each([
    ['keycloak', true],
    ['dex', false],
  ])('hides the import when authenticationLayer=%s and keycloak enabled=%s', (authenticationLayer, keycloakEnabled) => {
    mockSession(authenticationLayer, keycloakEnabled)

    renderMaintenance()

    expect(screen.queryByRole('button', { name: 'Import Keycloak users into Dex' })).not.toBeInTheDocument()
  })

  it('imports the users after confirming when Dex is the authentication layer and Keycloak is enabled', () => {
    mockSession('dex', true)

    renderMaintenance()
    fireEvent.click(screen.getByRole('button', { name: 'Import Keycloak users into Dex' }))
    fireEvent.click(screen.getByRole('button', { name: 'Import' }))

    expect(importKeycloakUsers).toHaveBeenCalledTimes(1)
  })

  it('shows the generated password and teams of created users and the reason of skipped users', () => {
    mockSession('dex', true)
    ;(useImportKeycloakUsersMutation as jest.Mock).mockReturnValue([
      importKeycloakUsers,
      {
        reset: jest.fn(),
        data: {
          results: [
            { email: 'new@example.com', status: 'created', initialPassword: 'Gen3rated!pw', teams: ['blue', 'red'] },
            { email: 'admin@example.com', status: 'skipped', reason: 'Platform admin is a Dex static password.' },
          ],
        },
      },
    ])

    renderMaintenance()
    fireEvent.click(screen.getByRole('button', { name: 'Import Keycloak users into Dex' }))

    expect(screen.getByText('Gen3rated!pw')).toBeInTheDocument()
    expect(screen.getByText('blue, red')).toBeInTheDocument()
    expect(screen.getByText('Platform admin is a Dex static password.')).toBeInTheDocument()
    expect(screen.getByText(/will not be shown again/)).toBeInTheDocument()
  })
})

describe('Maintenance Gitea user deletion', () => {
  const previewUsers = jest.fn()
  const deleteUsers = jest.fn()
  const previewData = {
    dryRun: true,
    results: [
      { username: 'alice', email: 'alice@example.com', repos: ['alice/notes'], status: 'dry-run' },
      { username: 'bob', email: 'bob@example.com', repos: [], status: 'dry-run' },
    ],
  }

  function mockSession({ authenticationLayer = 'dex', keycloak = true, gitea = true } = {}) {
    ;(useSession as jest.Mock).mockReturnValue({
      user: { isPlatformAdmin: true },
      appsEnabled: { keycloak, gitea },
      settings: { otomi: { oidc: { authenticationLayer } } },
      objectStorage: { showWizard: false, objStorageRegions: [] },
    })
  }

  // The modal calls the hook twice per render: first for the preview, then for the deletion
  function mockMutations(previewState = {}, deletionState = {}) {
    let calls = 0
    ;(useDeleteGiteaUsersMutation as jest.Mock).mockImplementation(() => {
      calls += 1
      return calls % 2 === 1
        ? [previewUsers, { reset: jest.fn(), ...previewState }]
        : [deleteUsers, { reset: jest.fn(), ...deletionState }]
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useGetSettingsQuery as jest.Mock).mockReturnValue({ data: { obj: {} } })
    ;(useCreateObjWizardMutation as jest.Mock).mockReturnValue([jest.fn()])
    ;(useImportKeycloakUsersMutation as jest.Mock).mockReturnValue([jest.fn(), { reset: jest.fn() }])
    previewUsers.mockReturnValue({ unwrap: () => Promise.resolve() })
    deleteUsers.mockReturnValue({ unwrap: () => Promise.resolve() })
    ;(useDeleteGiteaUsersMutation as jest.Mock).mockReturnValue([jest.fn(), { reset: jest.fn() }])
  })

  it('hides the action when Gitea is disabled', () => {
    mockSession({ gitea: false })

    renderMaintenance()

    expect(screen.queryByRole('button', { name: 'Delete Gitea users' })).not.toBeInTheDocument()
  })

  it.each([
    ['Keycloak is the authentication layer', { authenticationLayer: 'keycloak' }],
    ['Keycloak is disabled', { keycloak: false }],
  ])('shows the action when Gitea is enabled, also when %s', (_case, session) => {
    mockSession(session)

    renderMaintenance()

    expect(screen.getByRole('button', { name: 'Delete Gitea users' })).toBeInTheDocument()
  })

  it('asks for a dry run first', () => {
    mockSession()
    mockMutations()

    renderMaintenance()
    fireEvent.click(screen.getByRole('button', { name: 'Delete Gitea users' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show users' }))

    expect(previewUsers).toHaveBeenCalledWith({ dryRun: true })
    expect(deleteUsers).not.toHaveBeenCalled()
  })

  it('lists the users and their personal repositories, then deletes them after confirming', () => {
    mockSession()
    mockMutations({ data: previewData })

    renderMaintenance()
    fireEvent.click(screen.getByRole('button', { name: 'Delete Gitea users' }))

    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('alice/notes')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Delete 2 users' }))

    expect(deleteUsers).toHaveBeenCalledWith({ dryRun: false })
  })

  it('shows the status of each user and the error of failed users', () => {
    mockSession()
    mockMutations(
      { data: previewData },
      {
        data: {
          dryRun: false,
          results: [
            { username: 'alice', email: 'alice@example.com', repos: ['alice/notes'], status: 'deleted' },
            { username: 'bob', email: 'bob@example.com', status: 'failed', error: 'user is last owner of org' },
          ],
        },
      },
    )

    renderMaintenance()
    fireEvent.click(screen.getByRole('button', { name: 'Delete Gitea users' }))

    expect(screen.getByText('Deleted Gitea users')).toBeInTheDocument()
    expect(screen.getByText('deleted')).toBeInTheDocument()
    expect(screen.getByText('user is last owner of org')).toBeInTheDocument()
  })
})
