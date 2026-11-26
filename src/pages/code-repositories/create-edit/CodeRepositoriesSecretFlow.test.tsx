import React from 'react'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import palette from 'theme/palette'
import inputOverrides from 'theme/overrides/Input'
import SecretCreateEditPage from 'pages/secrets/team/create-edit/SecretCreateEditPage'
import CodeRepositoriesCreateEditPage from './CodeRepositoriesCreateEditPage'

jest.mock('@iconify/react', () => ({ Icon: () => null }))
jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}))
jest.mock('components/LandingHeader', () => ({
  LandingHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('components/DeleteButton', () => ({ __esModule: true, default: () => null }))
jest.mock('providers/Session', () => ({
  useSession: () => ({ settings: { cluster: { domainSuffix: 'example.com' } }, appsEnabled: {}, sealedSecretsPEM: '' }),
}))
jest.mock('redux/hooks', () => ({ useAppSelector: () => true }))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
jest.mock('redux/otomiApi', () => ({
  useGetAplCodeRepoQuery: () => mockRepoQuery,
  useGetTeamAplCodeReposQuery: () => ({ data: [savedRepo] }),
  useGetAplSealedSecretsQuery: () => ({
    data: [{ metadata: { name: 'new-secret' }, spec: { template: { type: 'kubernetes.io/basic-auth' } } }],
  }),
  useGetInternalRepoUrlsQuery: () => ({ data: [] }),
  useGetTestRepoConnectQuery: () => ({}),
  useCreateAplCodeRepoMutation: () => [mockCreateRepo, {}],
  useEditAplCodeRepoMutation: () => [mockUpdateRepo, {}],
  useDeleteAplCodeRepoMutation: () => [jest.fn(), {}],
  useGetAplSealedSecretQuery: () => ({}),
  useCreateAplSealedSecretMutation: () => [
    jest.fn(),
    { isSuccess: mockSecretCreated, data: { metadata: { name: 'new-secret' } } },
  ],
  useEditAplSealedSecretMutation: () => [jest.fn(), {}],
  useDeleteAplSealedSecretMutation: () => [jest.fn(), {}],
}))

const savedRepo = {
  kind: 'AplTeamCodeRepo',
  metadata: { name: 'repo-one', labels: { 'apl.io/teamId': 'alpha' } },
  spec: { gitService: 'github', repositoryUrl: 'https://github.com/example/repo', private: false },
  status: {},
}
const mockCreateRepo = jest.fn()
const mockUpdateRepo = jest.fn()
let mockSecretCreated = false
let mockRepoQuery: { data?: typeof savedRepo; isLoading?: boolean } = {}

const theme = createTheme({ palette: palette.light } as ThemeOptions)
theme.font = { normal: 'sans-serif', bold: 'sans-serif' }
theme.components = inputOverrides(theme)

function renderFlow(path: string) {
  const tree = () => (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <Route
          render={({ location }) => (
            <>
              <output aria-label='Current path'>{location.pathname}</output>
              <Switch>
                <Route path='/teams/:teamId/secrets/create' component={SecretCreateEditPage} />
                <Route path='/teams/:teamId/code-repositories/create' component={CodeRepositoriesCreateEditPage} />
                <Route
                  path='/teams/:teamId/code-repositories/:codeRepositoryName'
                  component={CodeRepositoriesCreateEditPage}
                />
              </Switch>
            </>
          )}
        />
      </MemoryRouter>
    </ThemeProvider>
  )
  const result = render(tree())
  return { user: userEvent.setup(), refresh: () => result.rerender(tree()) }
}

function input(name: string): HTMLInputElement {
  const element = document.querySelector<HTMLInputElement>(`input[name="${name}"]`)
  if (!element) throw new Error(`Input ${name} not found`)
  return element
}

beforeEach(() => {
  jest.clearAllMocks()
  mockSecretCreated = false
  mockRepoQuery = {}
})

it('returns to editing with the new secret and submits an update even if repository data loads later', async () => {
  mockRepoQuery = { data: savedRepo }
  const { user, refresh } = renderFlow('/teams/alpha/code-repositories/repo-one')

  await user.click(screen.getByRole('checkbox', { name: 'Private' }))
  await user.click(screen.getByRole('button', { name: '+ Create Secret' }))
  expect(screen.getByLabelText('Current path')).toHaveTextContent('/teams/alpha/secrets/create')

  mockRepoQuery = { isLoading: true }
  mockSecretCreated = true
  refresh()
  expect(screen.getByLabelText('Current path')).toHaveTextContent('/teams/alpha/code-repositories/repo-one')

  mockRepoQuery = { data: savedRepo }
  refresh()
  expect(input('spec.repositoryUrl')).toBeDisabled()
  expect(input('spec.repositoryUrl')).toHaveValue(savedRepo.spec.repositoryUrl)
  expect(screen.getByRole('checkbox', { name: 'Private' })).toBeChecked()
  expect(screen.getByText('new-secret')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Save Changes' }))
  await waitFor(() =>
    expect(mockUpdateRepo).toHaveBeenCalledWith(
      expect.objectContaining({
        teamId: 'alpha',
        codeRepositoryName: 'repo-one',
        body: expect.objectContaining({ spec: expect.objectContaining({ private: true, secret: 'new-secret' }) }),
      }),
    ),
  )
  expect(mockCreateRepo).not.toHaveBeenCalled()
})

it('returns to creation with the entered values and new secret', async () => {
  const { user, refresh } = renderFlow('/teams/alpha/code-repositories/create')
  await user.type(input('metadata.name'), 'new-repo')
  await user.type(input('spec.repositoryUrl'), 'https://github.com/example/new-repo')
  await user.click(screen.getByRole('checkbox', { name: 'Private' }))
  await user.click(screen.getByRole('button', { name: '+ Create Secret' }))

  mockSecretCreated = true
  refresh()

  expect(screen.getByLabelText('Current path')).toHaveTextContent('/teams/alpha/code-repositories/create')
  expect(input('metadata.name')).toHaveValue('new-repo')
  expect(input('spec.repositoryUrl')).toHaveValue('https://github.com/example/new-repo')
  expect(screen.getByRole('checkbox', { name: 'Private' })).toBeChecked()
  expect(screen.getByText('new-secret')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Add Code Repository' }))
  await waitFor(() =>
    expect(mockCreateRepo).toHaveBeenCalledWith(
      expect.objectContaining({
        teamId: 'alpha',
        body: expect.objectContaining({ spec: expect.objectContaining({ private: true, secret: 'new-secret' }) }),
      }),
    ),
  )
  expect(mockUpdateRepo).not.toHaveBeenCalled()
})
