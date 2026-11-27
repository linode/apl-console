import React from 'react'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route } from 'react-router-dom'
import type { GetAplTeamApiResponse } from 'redux/otomiApi'
import palette from '../../../theme/palette'
import TeamsCreateEditPage from './TeamsCreateEditPage'

const mockCreate = jest.fn()
const mockUpdate = jest.fn()
const mockDelete = jest.fn()
let mockIsAdmin = true
let mockTeam: GetAplTeamApiResponse | undefined

jest.mock('providers/Session', () => ({
  useSession: () => ({
    appsEnabled: { grafana: false, prometheus: false },
    user: { isPlatformAdmin: mockIsAdmin, isTeamAdmin: false },
    settings: {},
  }),
}))
jest.mock('hooks/useSettings', () => () => ({ themeView: 'platform' }))
jest.mock('redux/otomiApi', () => ({
  useCreateAplTeamMutation: () => [mockCreate, {}],
  useEditAplTeamMutation: () => [mockUpdate, {}],
  useDeleteAplTeamMutation: () => [mockDelete, {}],
  useGetAplTeamQuery: () => ({ data: mockTeam }),
  useGetAplTeamsQuery: () => ({ data: [] }),
}))
jest.mock('layouts/Paper', () => ({ __esModule: true, default: ({ children }) => <main>{children}</main> }))
jest.mock('components/LandingHeader', () => ({ LandingHeader: () => null }))
jest.mock('components/PermissionTable', () => ({ PermissionsTable: () => null }))
jest.mock('./TeamsResourceQuotaKeyValue', () => () => null)
jest.mock('components/DeleteButton', () => () => null)

const theme = createTheme({ palette: palette.light } as ThemeOptions)
theme.font = { normal: 'sans-serif', bold: 'sans-serif' }

function renderPage(path = '/teams/create') {
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <Route path='/teams/:teamId?' render={(props) => <TeamsCreateEditPage {...props} />} />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  mockIsAdmin = true
  mockTeam = undefined
})

it('allows an admin to enable team Grafana without platform Grafana and submit it', async () => {
  const user = userEvent.setup()
  // The create route has no teamId parameter.
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/teams']}>
        <Route path='/teams' exact render={(props) => <TeamsCreateEditPage {...props} />} />
      </MemoryRouter>
    </ThemeProvider>,
  )

  const checkbox = screen.getByRole('checkbox', { name: 'Enable dashboards' })
  expect(checkbox).toBeEnabled()
  expect(screen.queryByText(/Dashboards require Grafana/)).not.toBeInTheDocument()
  await user.type(screen.getAllByRole('textbox')[0], 'alpha')
  await user.click(checkbox)
  await user.click(screen.getByRole('button', { name: 'Create Team' }))
  await waitFor(() =>
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          spec: expect.objectContaining({ managedMonitoring: { grafana: true, alertmanager: false } }),
        }),
      }),
    ),
  )
})

it('allows an admin to disable an existing team Grafana deployment', async () => {
  mockTeam = {
    kind: 'AplTeamSettingSet',
    metadata: { name: 'alpha', labels: { 'apl.io/teamId': 'alpha' } },
    spec: { managedMonitoring: { grafana: true, alertmanager: false } },
    status: {},
  }
  const user = userEvent.setup()
  renderPage('/teams/alpha')

  const checkbox = screen.getByRole('checkbox', { name: 'Enable dashboards' })
  expect(checkbox).toBeChecked()
  expect(checkbox).toBeEnabled()
  await user.click(checkbox)
  await user.click(screen.getByRole('button', { name: 'Save Changes' }))
  await waitFor(() =>
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        teamId: 'alpha',
        body: expect.objectContaining({
          spec: expect.objectContaining({ managedMonitoring: { grafana: false, alertmanager: false } }),
        }),
      }),
    ),
  )
})

it('keeps the team Grafana setting read-only for non-admins', () => {
  mockIsAdmin = false
  renderPage('/teams/alpha')

  expect(screen.getByRole('checkbox', { name: 'Enable dashboards' })).toBeDisabled()
})
