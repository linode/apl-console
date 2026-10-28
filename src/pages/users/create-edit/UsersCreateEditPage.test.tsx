import React from 'react'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { MemoryRouter, Route, RouteComponentProps, Switch } from 'react-router-dom'
import type { GetAplTeamsApiResponse, GetUserApiResponse } from 'redux/otomiApi'
import palette from '../../../theme/palette'
import inputOverrides from '../../../theme/overrides/Input'
import UsersCreateEditPage from './UsersCreateEditPage'

jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ children, loading }: { children: React.ReactNode; loading?: boolean }) => (
    <main>
      {loading && <div role='status'>Loading user management</div>}
      {children}
    </main>
  ),
}))
jest.mock('components/LandingHeader', () => ({
  LandingHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('providers/Session', () => ({
  useSession: () => mockSession,
}))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, values?: { resourceType: string; resourceName: string }) => {
      if (key === 'delete') return 'Delete'
      if (key === 'DELETE_RESOURCE') return `Delete ${values.resourceType} ${values.resourceName}`
      if (key === 'DELETE_RESOURCE_CONFIRMATION') return `Confirm deletion of ${values.resourceName}`
      return key
    },
  }),
}))
jest.mock('redux/otomiApi', () => ({
  useGetUserQuery: (...args: unknown[]) => mockGetUserQuery(...args),
  useGetAplTeamsQuery: (...args: unknown[]) => mockGetTeamsQuery(...args),
  useCreateUserMutation: () => [mockCreate, mockMutationStates.create],
  useEditUserMutation: () => [mockUpdate, mockMutationStates.update],
  useDeleteUserMutation: () => [mockDelete, mockMutationStates.delete],
}))

interface QueryState<T> {
  currentData?: T
  data?: T
  isLoading: boolean
  isFetching: boolean
  isError: boolean
}

const queryState = <T,>(data?: T): QueryState<T> => ({
  currentData: data,
  data,
  isLoading: false,
  isFetching: false,
  isError: false,
})
const mutationState = () => ({ isLoading: false, isSuccess: false, isError: false })
const session = () => ({
  user: {
    isPlatformAdmin: true,
    isTeamAdmin: false,
    teams: ['alpha', 'beta'],
    authz: {} as Record<string, { deniedAttributes: { user: string[] } }>,
  },
  settings: { otomi: { hasExternalIDP: false, oidc: { authenticationLayer: 'keycloak' } } },
  defaultPlatformAdminEmail: 'admin@example.com',
})
const savedUser = (overrides: Partial<GetUserApiResponse> = {}): GetUserApiResponse => ({
  id: 'user-1',
  email: 'saved@example.com',
  firstName: '  Saved First  ',
  lastName: '  Saved Last  ',
  isPlatformAdmin: false,
  isTeamAdmin: true,
  teams: ['alpha'],
  initialPassword: 'fetched-secret-never-render',
  ...overrides,
})
const availableTeams: GetAplTeamsApiResponse = ['alpha', 'beta', 'unmanaged'].map((name) => ({
  kind: 'AplTeamSettingSet',
  metadata: { name, labels: { 'apl.io/teamId': name } },
  spec: {},
  status: {},
}))
let mockSession = session()
let mockQueries = {
  user: queryState<GetUserApiResponse>(),
  teams: queryState(availableTeams),
}
let mockMutationStates = {
  create: mutationState(),
  update: mutationState(),
  delete: mutationState(),
}
const mockGetUserQuery = jest.fn()
const mockGetTeamsQuery = jest.fn()
const mockCreate = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
const theme = createTheme({ palette: palette.light } as ThemeOptions)
theme.font = { normal: 'sans-serif', bold: 'sans-serif' }
theme.components = inputOverrides(theme)

function renderPage(path = '/users/create', state: object = undefined) {
  let history: RouteComponentProps['history']
  const tree = () => (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[{ pathname: path, state }]}>
        <Route
          render={(router) => {
            history = router.history
            return (
              <>
                <output aria-label='Current path'>{router.location.pathname}</output>
                <Switch>
                  <Route
                    exact
                    path={[
                      '/teams/:teamId/users/create',
                      '/teams/:teamId/users/:userId',
                      '/users/create',
                      '/users/:userId',
                    ]}
                    render={(props) => <UsersCreateEditPage {...props} />}
                  />
                  <Route exact path={['/users', '/teams/:teamId/users']}>
                    <h1>User directory</h1>
                  </Route>
                </Switch>
              </>
            )
          }}
        />
      </MemoryRouter>
    </ThemeProvider>
  )
  const result = render(tree())
  return {
    // Exercise native disabled controls even when MUI also blocks pointer events with CSS.
    user: userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never }),
    refresh: () => result.rerender(tree()),
    navigate: (nextPath: string, nextState?: object) => {
      act(() => history.push(nextPath, nextState))
    },
  }
}

async function fillCreate(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('textbox', { name: 'Email (required)' }), '  ada@example.com  ')
}

function expectNoMutations() {
  expect(mockCreate).not.toHaveBeenCalled()
  expect(mockUpdate).not.toHaveBeenCalled()
  expect(mockDelete).not.toHaveBeenCalled()
}

function expectPath(path: string) {
  expect(screen.getByLabelText('Current path')).toHaveTextContent(new RegExp(`^${path}$`))
}

async function confirmDelete(user: ReturnType<typeof userEvent.setup>, email = 'saved@example.com') {
  await user.click(screen.getByRole('button', { name: 'Delete' }))
  const dialog = screen.getByRole('dialog', { name: `Delete User email ${email}` })
  await user.type(within(dialog).getByRole('textbox', { name: 'User email name' }), email)
  await user.click(within(dialog).getByRole('button', { name: 'Delete' }))
}

beforeEach(() => {
  jest.clearAllMocks()
  mockSession = session()
  mockQueries = { user: queryState(), teams: queryState(availableTeams) }
  mockMutationStates = { create: mutationState(), update: mutationState(), delete: mutationState() }
  mockGetUserQuery.mockImplementation(() => mockQueries.user)
  mockGetTeamsQuery.mockImplementation(() => mockQueries.teams)
  mockCreate.mockReset().mockResolvedValue({ data: { initialPassword: 'new-user-password' } })
  mockUpdate.mockReset().mockResolvedValue({ data: {} })
  mockDelete.mockReset().mockResolvedValue({ data: undefined })
})

describe('creation and editing', () => {
  it.each(['empty', 'whitespace'])('requires email when %s', async (input) => {
    const { user } = renderPage()
    const email = screen.getByRole('textbox', { name: 'Email (required)' })
    if (input === 'whitespace') await user.type(email, '   ')
    await user.click(screen.getByRole('button', { name: 'Create User' }))
    expect(await screen.findByText('Email is required')).toBeVisible()
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expectNoMutations()
    expectPath('/users/create')
  })

  it('rejects an invalid email', async () => {
    const { user } = renderPage()
    await fillCreate(user)
    await user.clear(screen.getByRole('textbox', { name: 'Email (required)' }))
    await user.type(screen.getByRole('textbox', { name: 'Email (required)' }), 'invalid-address')
    await user.click(screen.getByRole('button', { name: 'Create User' }))
    expect(await screen.findByText('Enter a valid email address')).toBeVisible()
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expectNoMutations()
  })

  it.each([
    { role: 'User', isPlatformAdmin: false, isTeamAdmin: false, teams: ['alpha', 'beta'] },
    { role: 'Team admin', isPlatformAdmin: false, isTeamAdmin: true, teams: ['alpha', 'beta'] },
    { role: 'Platform admin', isPlatformAdmin: true, isTeamAdmin: false, teams: [] },
  ])('creates $role with explicit role/team mapping', async ({ role, ...expected }) => {
    const { user } = renderPage()
    expect(mockGetUserQuery).toHaveBeenLastCalledWith({ userId: undefined }, { skip: true })
    expect(mockGetTeamsQuery).toHaveBeenLastCalledWith(undefined, { skip: false })
    expect(screen.getByRole('heading', { name: 'Create' })).toBeVisible()
    expect(screen.queryByLabelText(/First Name|Last Name/)).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'User' })).toBeChecked()
    await fillCreate(user)
    await user.click(screen.getByRole('checkbox', { name: 'alpha' }))
    await user.click(screen.getByRole('checkbox', { name: 'beta' }))
    await user.click(screen.getByRole('radio', { name: role }))
    await user.click(screen.getByRole('button', { name: 'Create User' }))
    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        body: { email: 'ada@example.com', ...expected },
      }),
    )
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockDelete).not.toHaveBeenCalled()
    expectPath('/users/create')
    expect(await screen.findByRole('dialog', { name: 'User Created' })).toBeVisible()
    expect(screen.getByText('Initial password')).toBeVisible()
    expect(screen.queryByText('new-user-password')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expectPath('/users')
    expect(screen.getByRole('heading', { name: 'User directory' })).toBeVisible()
  })

  it('uses fetched edit details without exposing names or the initial password', async () => {
    mockQueries.user = queryState(savedUser())
    mockSession.settings.otomi.oidc.authenticationLayer = 'dex'
    const { user, refresh } = renderPage('/users/user-1', {
      user: savedUser({ email: 'route-state@example.com', firstName: 'Wrong', teams: ['beta'] }),
    })
    expect(mockGetUserQuery).toHaveBeenLastCalledWith({ userId: 'user-1' }, { skip: false })
    expect(screen.getByRole('heading', { name: 'Edit' })).toBeVisible()
    expect(screen.queryByLabelText(/First Name/)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Last Name/)).not.toBeInTheDocument()
    const email = screen.getByRole('textbox', { name: 'Email' })
    expect(email).toHaveValue('saved@example.com')
    expect(email).toHaveAttribute('readonly')
    expect(email).toBeEnabled()
    await user.type(email, 'changed')
    expect(email).toHaveValue('saved@example.com')
    const password = screen.getByLabelText('Password')
    expect(password).toHaveAttribute('type', 'password')
    expect(password).toHaveValue('')
    expect(password).toHaveAttribute('placeholder', '********')
    expect(password).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeEnabled()
    expect(screen.queryByText('fetched-secret-never-render')).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('fetched-secret-never-render')).not.toBeInTheDocument()
    expect(document.body.innerHTML).not.toContain('fetched-secret-never-render')
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'alpha' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'beta' })).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Update User' }))
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        userId: 'user-1',
        body: {
          email: 'saved@example.com',
          isPlatformAdmin: false,
          isTeamAdmin: true,
          teams: ['alpha'],
        },
      }),
    )
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockCreate).not.toHaveBeenCalled()
    mockMutationStates.update.isSuccess = true
    refresh()
    expectPath('/users')
    expect(screen.getByRole('heading', { name: 'User directory' })).toBeVisible()
  })

  it('resets a Dex password through the edit endpoint without asking for the old password', async () => {
    mockSession.settings.otomi.oidc.authenticationLayer = 'dex'
    mockQueries.user = queryState(savedUser())
    const { user } = renderPage('/users/user-1')

    await user.click(screen.getByRole('button', { name: 'Reset Password' }))
    const dialog = screen.getByRole('dialog', { name: 'Reset Password' })
    expect(within(dialog).getByLabelText(/New password/)).toBeVisible()
    expect(within(dialog).getByLabelText(/Confirm password/)).toBeVisible()
    expect(within(dialog).queryByLabelText(/old password|current password/i)).not.toBeInTheDocument()

    await user.type(within(dialog).getByLabelText(/New password/), 'new-secret-password')
    const confirmation = within(dialog).getByLabelText(/Confirm password/)
    await user.type(confirmation, 'does-not-match')
    await user.click(within(dialog).getByRole('button', { name: 'Reset' }))
    expect(within(dialog).getByText('Passwords do not match.')).toBeVisible()
    expectNoMutations()
    await user.clear(confirmation)
    await user.type(confirmation, 'new-secret-password')
    await user.click(within(dialog).getByRole('button', { name: 'Reset' }))

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        userId: 'user-1',
        body: { email: 'saved@example.com', initialPassword: 'new-secret-password' },
      }),
    )
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog', { name: 'Reset Password' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update User' })).toBeVisible()
  })

  it('does not show password reset for Keycloak users', () => {
    mockQueries.user = queryState(savedUser())
    renderPage('/users/user-1')
    expect(screen.queryByRole('button', { name: 'Reset Password' })).not.toBeInTheDocument()
  })

  it('restores saved team choices after a platform-role roundtrip and clears them in a platform payload', async () => {
    mockQueries.user = queryState(savedUser({ teams: ['alpha', 'beta'] }))
    const { user } = renderPage('/users/user-1')
    await user.click(screen.getByRole('radio', { name: 'Platform admin' }))
    expect(screen.getByRole('textbox', { name: 'Search teams' })).toBeDisabled()
    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeDisabled())
    expect(screen.getByRole('group', { name: 'Team selection' })).toHaveAccessibleDescription(
      'Platform admins have access to all teams. Team selections are not saved for platform admins.',
    )
    await user.click(screen.getByRole('radio', { name: 'Team admin' }))
    expect(screen.getByRole('checkbox', { name: 'alpha' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'beta' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'unmanaged' })).not.toBeChecked()
    expect(screen.getByRole('textbox', { name: 'Search teams' })).toBeEnabled()
    await user.click(screen.getByRole('radio', { name: 'Platform admin' }))
    await user.click(screen.getByRole('button', { name: 'Update User' }))
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        userId: 'user-1',
        body: {
          email: 'saved@example.com',
          isPlatformAdmin: true,
          isTeamAdmin: false,
          teams: [],
        },
      }),
    )
  })

  it('preselects only the route team and shows the initial password before redirecting', async () => {
    const { user } = renderPage('/teams/beta/users/create')
    expect(screen.getByRole('checkbox', { name: 'beta' })).toBeChecked()
    expect(screen.queryByRole('checkbox', { name: 'alpha' })).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'unmanaged' })).not.toBeInTheDocument()
    await fillCreate(user)
    await user.click(screen.getByRole('button', { name: 'Create User' }))
    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        body: {
          email: 'ada@example.com',
          isPlatformAdmin: false,
          isTeamAdmin: false,
          teams: ['beta'],
        },
      }),
    )
    expect(await screen.findByRole('dialog', { name: 'User Created' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expectPath('/teams/beta/users')
    expect(screen.getByRole('heading', { name: 'User directory' })).toBeVisible()
  })

  it('preserves existing memberships outside the route while updating its selectable team', async () => {
    mockQueries.user = queryState(savedUser({ teams: ['alpha', 'beta'] }))
    const { user, refresh } = renderPage('/teams/alpha/users/user-1')
    expect(screen.queryByRole('checkbox', { name: 'beta' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'alpha' }))
    await user.click(screen.getByRole('button', { name: 'Update User' }))
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        userId: 'user-1',
        body: {
          email: 'saved@example.com',
          isPlatformAdmin: false,
          isTeamAdmin: true,
          teams: ['beta'],
        },
      }),
    )
    mockMutationStates.update.isSuccess = true
    refresh()
    expectPath('/teams/alpha/users')
  })
})

describe('query availability and external identity providers', () => {
  it.each([
    ['user', 'isLoading'],
    ['user', 'isFetching'],
    ['teams', 'isLoading'],
    ['teams', 'isFetching'],
  ] as const)('blocks the form while %s query has %s, even with cached current data', (query, flag) => {
    mockQueries.user = queryState(savedUser())
    mockQueries[query][flag] = true
    const { refresh } = renderPage('/users/user-1')
    expect(screen.getByText('Loading user management')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Update User' })).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Email' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expectNoMutations()
    mockQueries[query][flag] = false
    refresh()
    expect(screen.queryByText('Loading user management')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update User' })).toBeEnabled()
  })

  it.each(['user', 'teams'] as const)('ignores stale %s data and route state when currentData is missing', (query) => {
    mockQueries.user = queryState(savedUser())
    mockQueries[query].currentData = undefined
    const { refresh } = renderPage('/users/user-1', { user: savedUser() })
    expect(screen.getByText('Loading user management')).toBeVisible()
    expect(screen.queryByRole('textbox', { name: 'Email' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Update User' })).not.toBeInTheDocument()
    expectNoMutations()
    expectPath('/users/user-1')
    mockQueries.user = queryState(savedUser())
    mockQueries.teams = queryState(availableTeams)
    refresh()
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('saved@example.com')
    expect(screen.getByRole('button', { name: 'Update User' })).toBeEnabled()
  })

  it.each(['user', 'teams'] as const)(
    'short-circuits on a %s query error despite cached data and fetching',
    (query) => {
      mockQueries.user = queryState(savedUser())
      mockQueries[query].isError = true
      mockQueries[query].isFetching = true
      const { refresh } = renderPage('/users/user-1')
      expect(screen.getByText('Unable to load user management data.')).toBeVisible()
      expect(screen.queryByText('Loading user management')).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox', { name: 'Email' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Update User' })).not.toBeInTheDocument()
      expectNoMutations()
      mockQueries[query].isError = false
      mockQueries[query].isFetching = false
      refresh()
      expect(screen.getByRole('button', { name: 'Update User' })).toBeEnabled()
    },
  )

  it.each(['loading', 'missing', 'error'])('blocks creation when the teams query is %s', (state) => {
    if (state === 'loading') mockQueries.teams.isLoading = true
    if (state === 'missing') mockQueries.teams.currentData = undefined
    if (state === 'error') mockQueries.teams.isError = true
    renderPage()
    expect(
      screen.getByText(state === 'error' ? 'Unable to load user management data.' : 'Loading user management'),
    ).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Create User' })).not.toBeInTheDocument()
    expectNoMutations()
  })

  it.each(['/users/create', '/users/user-1'])(
    'skips both queries and renders only the external IDP banner at %s',
    (path) => {
      mockSession.settings.otomi.hasExternalIDP = true
      mockQueries.user = { ...queryState(savedUser()), isError: true, isLoading: true }
      mockQueries.teams.isError = true
      renderPage(path)
      expect(
        screen.getByText('User management is only available when using the internal identity provider (IDP).'),
      ).toBeVisible()
      expect(mockGetUserQuery).toHaveBeenLastCalledWith(
        { userId: path === '/users/create' ? undefined : 'user-1' },
        { skip: true },
      )
      expect(mockGetTeamsQuery).toHaveBeenLastCalledWith(undefined, { skip: true })
      expect(screen.queryByText('Unable to load user management data.')).not.toBeInTheDocument()
      expect(screen.queryByText('Loading user management')).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expectNoMutations()
      expectPath(path)
    },
  )
})

describe('mutations and deletion', () => {
  it.each(['create', 'update', 'delete'] as const)(
    'blocks creation while the %s mutation is loading',
    async (mutation) => {
      const { user, refresh } = renderPage()
      await fillCreate(user)
      mockMutationStates[mutation].isLoading = true
      refresh()
      const submit = screen.getByRole('button', { name: 'Create User' })
      expect(submit).toBeDisabled()
      expect(screen.getByRole('textbox', { name: 'Email (required)' })).toBeDisabled()
      screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled())
      screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeDisabled())
      await user.click(submit)
      await user.keyboard('{Enter}')
      expectNoMutations()
      expectPath('/users/create')
    },
  )

  it.each(['create', 'update', 'delete'] as const)(
    'blocks update, deletion, and success redirects while the %s mutation is loading',
    async (mutation) => {
      mockQueries.user = queryState(savedUser())
      mockMutationStates[mutation] = { isLoading: true, isSuccess: true, isError: false }
      const { user, refresh } = renderPage('/users/user-1')
      expect(screen.getByRole('button', { name: 'Update User' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
      await user.click(screen.getByRole('button', { name: 'Update User' }))
      await user.click(screen.getByRole('button', { name: 'Delete' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expectNoMutations()
      expectPath('/users/user-1')
      mockMutationStates[mutation].isLoading = false
      refresh()
      expectPath(mutation === 'create' ? '/users/user-1' : '/users')
    },
  )

  it.each(['create', 'update'] as const)(
    'prevents duplicate %s submissions until the mutation promise settles',
    async (mutation) => {
      let finish: (value: { data: object }) => void
      const pending = new Promise<{ data: object }>((resolve) => {
        finish = resolve
      })
      const trigger = mutation === 'create' ? mockCreate : mockUpdate
      trigger.mockReturnValueOnce(pending)
      mockQueries.user = queryState(mutation === 'update' ? savedUser() : undefined)
      const path = mutation === 'create' ? '/users/create' : '/users/user-1'
      const { user, refresh } = renderPage(path)
      if (mutation === 'create') await fillCreate(user)
      const submit = screen.getByRole('button', { name: mutation === 'create' ? 'Create User' : 'Update User' })
      await user.click(submit)
      await waitFor(() => expect(trigger).toHaveBeenCalledTimes(1))
      expect(submit).toBeDisabled()
      await user.click(submit)
      await user.keyboard('{Enter}')
      expect(trigger).toHaveBeenCalledTimes(1)
      expectPath(path)
      await act(async () => {
        finish({ data: {} })
        await pending
      })
      expect(submit).toBeEnabled()
      expectPath(path)
      if (mutation === 'create') await user.click(screen.getByRole('button', { name: 'Close' }))
      else {
        mockMutationStates.update.isSuccess = true
        refresh()
      }
      expectPath('/users')
    },
  )

  it.each(['create', 'update', 'delete'] as const)('does not redirect after a failed %s mutation', async (mutation) => {
    const failure = { error: { status: 500, data: { message: 'Mutation failed' } } }
    mockCreate.mockResolvedValue(failure)
    mockUpdate.mockResolvedValue(failure)
    mockDelete.mockResolvedValue(failure)
    const creating = mutation === 'create'
    mockQueries.user = queryState(creating ? undefined : savedUser())
    const path = creating ? '/users/create' : '/users/user-1'
    const { user, refresh } = renderPage(path)
    if (creating) await fillCreate(user)
    if (mutation === 'delete') await confirmDelete(user)
    else await user.click(screen.getByRole('button', { name: creating ? 'Create User' : 'Update User' }))
    const triggers = { create: mockCreate, update: mockUpdate, delete: mockDelete }
    await waitFor(() => expect(triggers[mutation]).toHaveBeenCalledTimes(1))
    mockMutationStates[mutation].isError = true
    refresh()
    expectPath(path)
    expect(screen.queryByRole('heading', { name: 'User directory' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: creating ? 'Create' : 'Edit', hidden: true })).toBeInTheDocument()
  })

  it('disables deletion for the default platform administrator without blocking updates', async () => {
    mockQueries.user = queryState(
      savedUser({ email: mockSession.defaultPlatformAdminEmail, isPlatformAdmin: true, isTeamAdmin: false, teams: [] }),
    )
    const { user } = renderPage('/users/user-1')
    expect(screen.getByRole('radio', { name: 'Platform admin' })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Update User' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expectNoMutations()
  })

  it.each([
    ['/users/user-1', '/users'],
    ['/teams/alpha/users/user-1', '/teams/alpha/users'],
  ])('requires exact confirmation in the real delete dialog and redirects from %s to %s', async (path, destination) => {
    mockQueries.user = queryState(savedUser())
    const { user, refresh } = renderPage(path)
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    let dialog = screen.getByRole('dialog', { name: 'Delete User email saved@example.com' })
    expect(within(dialog).getByRole('button', { name: 'Delete' })).toBeDisabled()
    await user.type(within(dialog).getByRole('textbox', { name: 'User email name' }), 'wrong@example.com')
    expect(within(dialog).getByRole('button', { name: 'Delete' })).toBeDisabled()
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))
    expectNoMutations()
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    dialog = screen.getByRole('dialog')
    const confirmation = within(dialog).getByRole('textbox', { name: 'User email name' })
    expect(confirmation).toHaveValue('')
    await user.type(confirmation, 'saved@example.com')
    expect(within(dialog).getByRole('button', { name: 'Delete' })).toBeEnabled()
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith({ userId: 'user-1' })
    expect(mockCreate).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
    mockMutationStates.delete.isLoading = true
    refresh()
    expect(within(dialog).getByRole('button', { name: 'Delete' })).toBeDisabled()
    expectPath(path)
    mockMutationStates.delete = { isLoading: false, isSuccess: true, isError: false }
    refresh()
    expectPath(destination)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'User directory' })).toBeVisible()
  })
})

describe('authorization', () => {
  it.each(['/users/create', '/users/user-1'])('makes %s readonly for an ordinary user', async (path) => {
    mockSession.user.isPlatformAdmin = false
    mockQueries.user = queryState(path === '/users/create' ? undefined : savedUser())
    const { user } = renderPage(path)
    expect(screen.getByText('This page is readonly')).toBeVisible()
    screen.getAllByRole('textbox').forEach((textbox) => expect(textbox).toBeDisabled())
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled())
    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeDisabled())
    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
    await user.click(screen.getByRole('radio', { name: 'Platform admin' }))
    await user.click(screen.getByRole('button', { name: path === '/users/create' ? 'Create User' : 'Update User' }))
    expectNoMutations()
    expectPath(path)
  })

  it('allows a team admin to assign only managed teams and non-platform roles', async () => {
    mockSession.user.isPlatformAdmin = false
    mockSession.user.isTeamAdmin = true
    const { user } = renderPage()
    await fillCreate(user)
    expect(screen.getByRole('radio', { name: 'Platform admin' })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: 'Platform admin' }))
    expect(screen.getByRole('radio', { name: 'User' })).toBeChecked()
    expect(screen.queryByRole('checkbox', { name: 'unmanaged' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: 'Select all' }))
    await user.click(screen.getByRole('radio', { name: 'Team admin' }))
    await user.click(screen.getByRole('button', { name: 'Create User' }))
    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        body: {
          email: 'ada@example.com',
          isPlatformAdmin: false,
          isTeamAdmin: true,
          teams: ['alpha', 'beta'],
        },
      }),
    )
  })

  it.each([{ teams: ['alpha', 'unmanaged'] }, { teams: [] }])(
    'makes an out-of-managed-scope target readonly: $teams',
    async ({ teams }) => {
      mockSession.user.isPlatformAdmin = false
      mockSession.user.isTeamAdmin = true
      mockQueries.user = queryState(savedUser({ teams }))
      const { user } = renderPage('/users/user-1')
      expect(
        screen.getByText(
          'This page is readonly: this user has memberships outside your managed teams, or no managed membership. Team admin access applies to all memberships.',
        ),
      ).toBeVisible()
      expect(screen.getByRole('button', { name: 'Update User' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
      screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled())
      screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeDisabled())
      await user.click(screen.getByRole('button', { name: 'Update User' }))
      await user.click(screen.getByRole('button', { name: 'Delete' }))
      expectNoMutations()
    },
  )

  it.each([
    { path: '/teams/unmanaged/users/create', target: undefined },
    { path: '/teams/beta/users/user-1', target: savedUser() },
    { path: '/users/user-1', target: savedUser({ isPlatformAdmin: true }) },
    { path: '/users/user-1', target: savedUser({ email: 'admin@example.com' }) },
  ])('blocks a team admin outside the route or against a protected target at $path', ({ path, target }) => {
    mockSession.user.isPlatformAdmin = false
    mockSession.user.isTeamAdmin = true
    mockQueries.user = queryState(target)
    renderPage(path)
    expect(screen.getByText('This page is readonly')).toBeVisible()
    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
    expectNoMutations()
  })

  it.each([
    { denied: ['isPlatformAdmin', 'isTeamAdmin', 'teams'] },
    { denied: ['isPlatformAdmin', 'isTeamAdmin', 'teams[0]'] },
    { denied: ['isPlatformAdmin', 'isTeamAdmin', 'teams.name'] },
    { denied: ['*'] },
  ])('preserves denied role and team attributes: $denied', async ({ denied }) => {
    mockSession.user.isPlatformAdmin = false
    mockSession.user.isTeamAdmin = true
    mockSession.user.authz.beta = { deniedAttributes: { user: denied } }
    mockQueries.user = queryState(savedUser({ teams: ['alpha', 'beta'] }))
    const { user } = renderPage('/teams/alpha/users/user-1')
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'User' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Platform admin' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Search teams' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'alpha' })).toBeChecked()
    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).toBeDisabled())
    await user.click(screen.getByRole('radio', { name: 'User' }))
    await user.click(screen.getByRole('checkbox', { name: 'alpha' }))
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'alpha' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Update User' }))
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        userId: 'user-1',
        body: {
          email: 'saved@example.com',
          isPlatformAdmin: false,
          isTeamAdmin: true,
          teams: ['alpha', 'beta'],
        },
      }),
    )
  })

  it('blocks creation when email is denied', async () => {
    mockSession.user.isPlatformAdmin = false
    mockSession.user.isTeamAdmin = true
    mockSession.user.authz.alpha = { deniedAttributes: { user: ['email'] } }
    const { user } = renderPage('/teams/alpha/users/create')
    expect(
      screen.getByText('User creation is unavailable because you cannot edit the required user details.'),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Create User' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Create User' }))
    expectNoMutations()
  })
})

describe('route changes', () => {
  it('resets user fields and team search for a new userId even when currentData has the same identity', async () => {
    mockQueries.user = queryState(savedUser())
    const { user, navigate, refresh } = renderPage('/users/user-1')
    await user.click(screen.getByRole('radio', { name: 'User' }))
    await user.click(screen.getByRole('checkbox', { name: 'beta' }))
    await user.type(screen.getByRole('textbox', { name: 'Search teams' }), 'beta')
    navigate('/users/user-2')
    expect(mockGetUserQuery).toHaveBeenLastCalledWith({ userId: 'user-2' }, { skip: false })
    expect(screen.getByRole('textbox', { name: 'Search teams' })).toHaveValue('')
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'alpha' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'beta' })).not.toBeChecked()
    mockQueries.user = queryState(
      savedUser({
        id: 'user-2',
        email: 'second@example.com',
        firstName: 'Second',
        isTeamAdmin: false,
        teams: ['beta'],
      }),
    )
    refresh()
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('second@example.com')
    expect(screen.getByRole('radio', { name: 'User' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'alpha' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'beta' })).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Update User' }))
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        userId: 'user-2',
        body: {
          email: 'second@example.com',
          isPlatformAdmin: false,
          isTeamAdmin: false,
          teams: ['beta'],
        },
      }),
    )
  })

  it('waits for the new user currentData instead of reusing previous data or route state', async () => {
    mockQueries.user = queryState(savedUser())
    const { user, navigate, refresh } = renderPage('/users/user-1')
    await user.type(screen.getByRole('textbox', { name: 'Search teams' }), 'alpha')
    mockQueries.user.currentData = undefined
    mockQueries.user.isFetching = true
    navigate('/users/user-2', { user: savedUser({ email: 'route-state@example.com' }) })
    expect(mockGetUserQuery).toHaveBeenLastCalledWith({ userId: 'user-2' }, { skip: false })
    expect(screen.getByText('Loading user management')).toBeVisible()
    expect(screen.queryByRole('textbox', { name: 'Email' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Update User' })).not.toBeInTheDocument()
    expectNoMutations()
    mockQueries.user = queryState(
      savedUser({ id: 'user-2', email: 'second@example.com', isTeamAdmin: false, teams: ['beta'] }),
    )
    refresh()
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('second@example.com')
    expect(screen.getByRole('textbox', { name: 'Search teams' })).toHaveValue('')
    expect(screen.getByRole('checkbox', { name: 'alpha' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'beta' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'User' })).toBeChecked()
  })

  it('resets unsaved details, role, selection, validation and team search when teamId changes', async () => {
    const { user, navigate } = renderPage('/teams/alpha/users/create')
    await user.click(screen.getByRole('button', { name: 'Create User' }))
    expect(await screen.findByText('Email is required')).toBeVisible()
    await user.click(screen.getByRole('radio', { name: 'Team admin' }))
    await user.click(screen.getByRole('checkbox', { name: 'alpha' }))
    await user.type(screen.getByRole('textbox', { name: 'Search teams' }), 'alpha')
    navigate('/teams/beta/users/create')
    expect(screen.getByRole('textbox', { name: 'Email (required)' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'Search teams' })).toHaveValue('')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'User' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'beta' })).toBeChecked()
    expect(screen.queryByRole('checkbox', { name: 'alpha' })).not.toBeInTheDocument()
    expectNoMutations()
    await fillCreate(user)
    await user.click(screen.getByRole('button', { name: 'Create User' }))
    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith({
        body: {
          email: 'ada@example.com',
          isPlatformAdmin: false,
          isTeamAdmin: false,
          teams: ['beta'],
        },
      }),
    )
  })
})
