import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { setSpec } from 'common/api-spec'
import type { GetAplTeamsApiResponse, GetPolicyApiResponse, GetTeamPoliciesApiResponse } from 'redux/otomiApi'
import font from 'theme/font'
import palette from 'theme/palette'
import { customValuePolicies } from './create-edit-policies.validator'
import PoliciesCreateEditPage from './PoliciesCreateEditPage'

jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ comp, loading }: { comp: React.ReactNode; loading?: boolean }) => (
    <main>{loading ? <div role='status'>Loading policy</div> : comp}</main>
  ),
}))
jest.mock('components/LandingHeader', () => ({
  LandingHeader: ({ title, docsLink }: { title: string; docsLink: string }) => (
    <header>
      <h1>{title}</h1>
      <a href={docsLink}>Documentation</a>
    </header>
  ),
}))
jest.mock('components/Section', () => ({
  __esModule: true,
  default: ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
    <section aria-label={title}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </section>
  ),
}))
jest.mock('providers/Session', () => ({ useSession: () => mockSession }))
jest.mock('redux/hooks', () => ({ useAppSelector: () => mockGlobal.isDirty }))
jest.mock('redux/otomiApi', () => ({
  useGetPolicyQuery: (...args: unknown[]) => mockGetPolicy(...args),
  useGetAplTeamsQuery: () => mockQueries.teams,
  useEditPolicyMutation: () => [mockUpdate, mockMutation],
}))
jest.mock('utils/snack', () => ({
  __esModule: true,
  default: {
    success: (...args: unknown[]) => mockSuccess(...args),
    error: (...args: unknown[]) => mockError(...args),
  },
}))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, values?: { name?: string; teamId?: string }) =>
      key === 'FORM_TITLE_TEAM' ? `Policy ${values.name} for team ${values.teamId}` : key,
  }),
}))

interface QueryState<T> {
  currentData?: T
  data?: T
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  refetch: jest.Mock
}

const queryState = <T,>(data?: T): QueryState<T> => ({
  currentData: data,
  data,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: jest.fn(),
})
const teamData = (enabled: boolean): GetAplTeamsApiResponse => [
  {
    kind: 'AplTeamSettingSet',
    metadata: { name: 'alpha', labels: { 'apl.io/teamId': 'alpha' } },
    spec: {
      selfService: {
        teamMembers: {
          editSecurityPolicies: enabled,
          createServices: false,
          useCloudShell: false,
          downloadKubeconfig: false,
          downloadDockerLogin: false,
        },
      },
    },
    status: {},
  },
]
const session = () => ({
  oboTeamId: 'alpha',
  user: {
    isPlatformAdmin: false,
    isTeamAdmin: false,
    authz: { alpha: { deniedAttributes: { policy: [] as string[] } } },
  },
})
let mockSession = session()
const mockGlobal = { isDirty: undefined as boolean | undefined }
const mockMutation = { isLoading: false }
const mockGetPolicy = jest.fn()
const mockUpdate = jest.fn()
const mockSuccess = jest.fn()
const mockError = jest.fn()
let mockQueries = {
  policy: queryState<GetPolicyApiResponse>(),
  teams: queryState<GetAplTeamsApiResponse>(),
}
const theme = createTheme({ palette: palette.light, font })

beforeEach(() => {
  jest.clearAllMocks()
  mockSession = session()
  mockGlobal.isDirty = undefined
  mockMutation.isLoading = false
  mockQueries = {
    policy: queryState({ action: 'Audit', severity: 'medium', customValues: ['first'] }),
    teams: queryState(teamData(true)),
  }
  mockGetPolicy.mockImplementation(() => mockQueries.policy)
  mockUpdate.mockResolvedValue({ data: { action: 'Enforce', severity: 'high' } })
  setSpec({
    components: {
      schemas: {
        Policies: {
          properties: {
            'allowed-image-repositories': { description: 'Allowed image repositories description' },
            'disallow-host-path': { description: 'Host path policy description' },
          },
        },
      },
    },
  })
})

function renderPage(path = '/teams/alpha/policies/allowed-image-repositories') {
  let history: RouteComponentProps['history']
  const tree = () => (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <Route
          render={(router) => {
            history = router.history
            return (
              <>
                <div aria-label='Current path'>{router.location.pathname}</div>
                <Switch>
                  <Route
                    exact
                    path={['/teams/:teamId/policies/:policyName', '/policies/:policyName']}
                    component={PoliciesCreateEditPage}
                  />
                  <Route exact path={['/teams/:teamId/policies', '/policies']}>
                    <h1>Policy overview</h1>
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
    user: userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never }),
    refresh: () => result.rerender(tree()),
    navigate: (nextPath: string) => act(() => history.push(nextPath)),
  }
}

const saveButton = () => screen.getByRole('button', { name: 'Save Changes' })

test('edits static fields and custom values, preserves hidden values, then navigates on success', async () => {
  Object.assign(mockQueries.policy.currentData, { id: 'hidden-id', name: 'hidden-name', futureField: { keep: true } })
  const { user } = renderPage()
  expect(screen.getByText('Allowed image repositories description')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute(
    'href',
    'https://techdocs.akamai.com/app-platform/docs/team-security-policies',
  )
  expect(screen.getByRole('radio', { name: 'Audit' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked()
  expect(saveButton()).toBeDisabled()
  await user.click(screen.getByRole('radio', { name: 'Enforce' }))
  await user.click(screen.getByRole('radio', { name: 'High' }))
  await user.clear(screen.getByLabelText('Custom value 1'))
  await user.type(screen.getByLabelText('Custom value 1'), 'updated')
  await user.click(screen.getByRole('button', { name: 'Add custom value' }))
  await user.type(screen.getByLabelText('Custom value 2'), 'second')
  await user.click(screen.getByRole('button', { name: 'Remove custom value 1' }))
  await user.click(screen.getByRole('button', { name: 'Add custom value' }))
  await user.click(saveButton())
  await screen.findByRole('heading', { name: 'Policy overview' })
  expect(mockUpdate).toHaveBeenCalledWith({
    teamId: 'alpha',
    policyName: 'allowed-image-repositories',
    body: { action: 'Enforce', severity: 'high', customValues: ['second'], futureField: { keep: true } },
  })
  expect(mockSuccess).toHaveBeenCalledWith('Policy saved successfully')
  expect(mockError).not.toHaveBeenCalled()
  expect(screen.getByLabelText('Current path')).toHaveTextContent('/teams/alpha/policies')
})

test.each(customValuePolicies)(
  '%s has explicit editable custom values without needing a field schema',
  async (policyName) => {
    const { user } = renderPage(`/teams/alpha/policies/${policyName}`)
    await user.click(screen.getByRole('button', { name: 'Remove custom value 1' }))
    await user.click(saveButton())
    await screen.findByRole('heading', { name: 'Policy overview' })
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        teamId: 'alpha',
        policyName,
        body: { action: 'Audit', severity: 'medium', customValues: [] },
      }),
    )
  },
)

const simplePolicies: ReadonlyArray<keyof GetTeamPoliciesApiResponse> = [
  'disallow-capabilities-strict',
  'disallow-host-namespaces',
  'disallow-host-path',
  'disallow-host-ports',
  'disallow-host-process',
  'disallow-latest-tag',
  'disallow-privilege-escalation',
  'disallow-privileged-containers',
  'disallow-proc-mount',
  'disallow-selinux',
  'require-limits',
  'require-liveness-probe',
  'require-non-root-groups',
  'require-readiness-probe',
  'require-requests',
  'require-run-as-non-root-user',
  'require-run-as-nonroot',
  'require-startup-probe',
  'restrict-apparmor-profiles',
  'restrict-seccomp',
  'restrict-seccomp-strict',
  'restrict-sysctls',
]
test.each(simplePolicies)(
  '%s renders static action/severity controls and preserves non-editable fields',
  async (policyName) => {
    renderPage(`/teams/alpha/policies/${policyName}`)
    expect(screen.queryByRole('button', { name: 'Add custom value' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Enforce' }))
    fireEvent.click(saveButton())
    await screen.findByRole('heading', { name: 'Policy overview' })
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith({
        teamId: 'alpha',
        policyName,
        body: { action: 'Enforce', severity: 'medium', customValues: ['first'] },
      }),
    )
  },
)

test('does not generate fields from API schema properties', () => {
  setSpec({
    components: {
      schemas: {
        Policies: {
          properties: {
            'disallow-host-path': {
              properties: { customValues: { type: 'array' }, injectedField: { type: 'string' } },
            },
          },
        },
      },
    },
  })
  renderPage('/teams/alpha/policies/disallow-host-path')
  expect(screen.queryByRole('button', { name: 'Add custom value' })).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Injected field')).not.toBeInTheDocument()
})

test('shows defaults for missing action/severity and removes empty custom values', async () => {
  mockQueries.policy.currentData = { action: undefined, severity: undefined, customValues: ['', 'retained'] }
  const { user } = renderPage()
  expect(screen.getByRole('radio', { name: 'Audit' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'Medium' })).toBeChecked()
  await user.click(screen.getByRole('radio', { name: 'Low' }))
  await user.click(saveButton())
  await screen.findByRole('heading', { name: 'Policy overview' })
  await waitFor(() =>
    expect(mockUpdate.mock.calls[0][0].body).toEqual({ action: 'Audit', severity: 'low', customValues: ['retained'] }),
  )
})

test('field-level ACL restrictions remain read-only and preserve their saved values', async () => {
  mockSession.user.authz.alpha.deniedAttributes.policy = ['action', 'customValues']
  const { user } = renderPage()
  expect(screen.getByRole('radio', { name: 'Enforce' })).toBeDisabled()
  expect(screen.getByLabelText('Custom value 1')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Add custom value' })).toBeDisabled()
  await user.click(screen.getByRole('radio', { name: 'High' }))
  await user.click(saveButton())
  await screen.findByRole('heading', { name: 'Policy overview' })
  await waitFor(() =>
    expect(mockUpdate.mock.calls[0][0].body).toEqual({ action: 'Audit', severity: 'high', customValues: ['first'] }),
  )
})

test.each([
  ['severity', 'High'],
  ['customValues.0', 'Custom value 1'],
  ['customValues[0]', 'Custom value 1'],
])('respects %s field restrictions', (attribute, label) => {
  mockSession.user.authz.alpha.deniedAttributes.policy = [attribute]
  renderPage()
  expect(screen.getByLabelText(label)).toBeDisabled()
})

test.each(['self-service disabled', 'outside route scope', 'all fields denied'])(
  '%s prevents policy updates',
  (scenario) => {
    if (scenario === 'self-service disabled') mockQueries.teams.currentData = teamData(false)
    if (scenario === 'outside route scope') mockSession.oboTeamId = 'beta'
    if (scenario === 'all fields denied') mockSession.user.authz.alpha.deniedAttributes.policy = ['*']
    renderPage()
    expect(screen.getByText('This page is readonly')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Enforce' })).toBeDisabled()
    expect(saveButton()).toBeDisabled()
    fireEvent.submit(saveButton().closest('form'))
    expect(mockUpdate).not.toHaveBeenCalled()
  },
)

test('platform administrators can edit even when self-service and field permissions deny updates', async () => {
  mockSession.user.isPlatformAdmin = true
  mockSession.oboTeamId = 'other'
  mockSession.user.authz.alpha.deniedAttributes.policy = ['*']
  mockQueries.teams.currentData = teamData(false)
  const { user } = renderPage()
  await user.click(screen.getByRole('radio', { name: 'Enforce' }))
  await user.click(saveButton())
  await screen.findByRole('heading', { name: 'Policy overview' })
  await waitFor(() => expect(mockUpdate).toHaveBeenCalled())
})

test.each(['/policies/disallow-host-path', '/teams/admin/policies/disallow-host-path'])(
  'admin policy route %s uses the admin team',
  async (path) => {
    mockSession.user.isPlatformAdmin = true
    const { user } = renderPage(path)
    expect(mockGetPolicy).toHaveBeenCalledWith({ teamId: 'admin', policyName: 'disallow-host-path' })
    await user.click(screen.getByRole('radio', { name: 'Enforce' }))
    await user.click(saveButton())
    await screen.findByRole('heading', { name: 'Policy overview' })
    expect(mockUpdate.mock.calls[0][0].teamId).toBe('admin')
    expect(screen.getByLabelText('Current path')).toHaveTextContent('/teams/admin/policies')
  },
)

test('admin-team policies retain edit access without the team self-service flag', async () => {
  mockSession.oboTeamId = 'admin'
  const { user } = renderPage('/teams/admin/policies/disallow-host-path')
  await user.click(screen.getByRole('radio', { name: 'Enforce' }))
  await user.click(saveButton())
  await screen.findByRole('heading', { name: 'Policy overview' })
  await waitFor(() => expect(mockUpdate).toHaveBeenCalled())
})

test.each(['policy', 'teams'] as const)('shows %s loading and errors without allowing a save', (query) => {
  mockQueries[query].isLoading = true
  mockQueries[query].currentData = undefined
  const { refresh } = renderPage()
  expect(screen.getByRole('status')).toHaveTextContent('Loading policy')
  expect(screen.queryByRole('button', { name: 'Save Changes' })).not.toBeInTheDocument()
  mockQueries[query].isLoading = false
  mockQueries[query].isError = true
  refresh()
  expect(screen.getByText('Unable to load policy data. Please try again.')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Save Changes' })).not.toBeInTheDocument()
})

test.each(['policy', 'teams'] as const)('blocks updates while %s data is refetching', (query) => {
  mockQueries[query].isFetching = true
  renderPage()
  expect(screen.getByRole('radio', { name: 'Enforce' })).toBeDisabled()
  fireEvent.submit(saveButton().closest('form'))
  expect(mockUpdate).not.toHaveBeenCalled()
})

test('failed save keeps edits and allows retry without success feedback or navigation', async () => {
  mockUpdate.mockResolvedValueOnce({ error: { status: 500 } })
  const { user } = renderPage()
  await user.click(screen.getByRole('radio', { name: 'Enforce' }))
  await user.click(saveButton())
  await waitFor(() => expect(mockError).toHaveBeenCalledWith('Unable to save policy. Please try again.'))
  expect(mockSuccess).not.toHaveBeenCalled()
  expect(screen.getByLabelText('Current path')).toHaveTextContent('/teams/alpha/policies/allowed-image-repositories')
  expect(screen.getByRole('radio', { name: 'Enforce' })).toBeChecked()
  await user.click(saveButton())
  await screen.findByRole('heading', { name: 'Policy overview' })
  expect(mockUpdate).toHaveBeenCalledTimes(2)
})

test('save is disabled during an ongoing mutation', () => {
  mockMutation.isLoading = true
  renderPage()
  expect(screen.getByRole('radio', { name: 'Enforce' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Add custom value' })).toBeDisabled()
  expect(saveButton()).toBeDisabled()
})

test('equivalent refetches preserve edits while changed server values reset the form', async () => {
  const { user, refresh } = renderPage()
  await user.click(screen.getByRole('radio', { name: 'Enforce' }))
  mockQueries.policy.currentData = { action: 'Audit', severity: 'medium', customValues: ['first'] }
  refresh()
  expect(screen.getByRole('radio', { name: 'Enforce' })).toBeChecked()
  mockQueries.policy.currentData = { action: 'Audit', severity: 'low', customValues: ['new'] }
  refresh()
  expect(screen.getByRole('radio', { name: 'Audit' })).toBeChecked()
  expect(screen.getByLabelText('Custom value 1')).toHaveValue('new')
  expect(saveButton()).toBeDisabled()
})

test('navigation between policies does not render stale query data or retain unsaved edits', async () => {
  const { user, navigate, refresh } = renderPage()
  await user.click(screen.getByRole('radio', { name: 'Enforce' }))
  mockQueries.policy.currentData = undefined
  mockQueries.policy.isFetching = true
  navigate('/teams/alpha/policies/disallow-host-path')
  expect(screen.getByRole('status')).toBeInTheDocument()
  expect(screen.queryByLabelText('Custom value 1')).not.toBeInTheDocument()
  mockQueries.policy.currentData = { action: 'Audit', severity: 'low' }
  mockQueries.policy.isFetching = false
  refresh()
  expect(screen.getByRole('radio', { name: 'Audit' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'Low' })).toBeChecked()
  expect(saveButton()).toBeDisabled()
})

test('deploying changes refreshes policy and team data only when queries are idle', () => {
  const { refresh } = renderPage()
  mockGlobal.isDirty = false
  refresh()
  expect(mockQueries.policy.refetch).toHaveBeenCalledTimes(1)
  expect(mockQueries.teams.refetch).toHaveBeenCalledTimes(1)
  mockGlobal.isDirty = true
  refresh()
  mockQueries.policy.isFetching = true
  mockQueries.teams.isFetching = true
  mockGlobal.isDirty = false
  refresh()
  expect(mockQueries.policy.refetch).toHaveBeenCalledTimes(1)
  expect(mockQueries.teams.refetch).toHaveBeenCalledTimes(1)
})

test('cancel returns to the team policy overview without saving', async () => {
  const { user } = renderPage()
  await user.click(screen.getByRole('button', { name: 'Cancel' }))
  await screen.findByRole('heading', { name: 'Policy overview' })
  expect(mockUpdate).not.toHaveBeenCalled()
})

test('a policy with no custom values can add values while its other fields stay read-only', async () => {
  mockQueries.policy.currentData = { action: 'Enforce', severity: 'high' }
  mockSession.user.authz.alpha.deniedAttributes.policy = ['action', 'severity']
  const { user } = renderPage()
  await user.click(screen.getByRole('button', { name: 'Add custom value' }))
  await user.type(screen.getByLabelText('Custom value 1'), 'new-value')
  await user.click(saveButton())
  await screen.findByRole('heading', { name: 'Policy overview' })
  expect(mockUpdate.mock.calls[0][0].body).toEqual({ action: 'Enforce', severity: 'high', customValues: ['new-value'] })
})

test.each([
  ['action', 'invalid', 'High', 'Select a valid policy action'],
  ['severity', 'invalid', 'Enforce', 'Select a valid severity'],
])('validates %s in the real form before submitting', async (field, value, radio, message) => {
  Object.assign(mockQueries.policy.currentData, { [field]: value })
  const { user } = renderPage()
  await user.click(screen.getByRole('radio', { name: radio }))
  await user.click(saveButton())
  expect(await screen.findByText(message)).toBeInTheDocument()
  expect(mockUpdate).not.toHaveBeenCalled()
})

test('in-flight saves do not submit twice or navigate away from a different policy', async () => {
  let resolveSave: (value: { data: GetPolicyApiResponse }) => void
  const response = new Promise<{ data: GetPolicyApiResponse }>((resolve) => {
    resolveSave = resolve
  })
  mockUpdate.mockReturnValue(response)
  const { user, navigate } = renderPage()
  await user.click(screen.getByRole('radio', { name: 'Enforce' }))
  await user.click(saveButton())
  expect(saveButton()).toBeDisabled()
  fireEvent.submit(saveButton().closest('form'))
  expect(mockUpdate).toHaveBeenCalledTimes(1)
  mockQueries.policy.currentData = { action: 'Audit', severity: 'low' }
  navigate('/teams/alpha/policies/disallow-host-path')
  await act(async () => {
    resolveSave({ data: { action: 'Enforce', severity: 'medium' } })
    await response
  })
  expect(screen.getByLabelText('Current path')).toHaveTextContent('/teams/alpha/policies/disallow-host-path')
  expect(mockSuccess).not.toHaveBeenCalled()
})
