import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PageLayout from './Paper'

const mockUseGetGitSettingsQuery = jest.fn()
const mockUseSession = jest.fn()

jest.mock('providers/Session', () => ({
  useSession: () => mockUseSession(),
}))

jest.mock('redux/otomiApi', () => ({
  useGetGitSettingsQuery: (...args: any[]) => mockUseGetGitSettingsQuery(...args),
}))

jest.mock(
  'components/modals/ConfigureGitModal',
  () =>
    function () {
      return <div data-testid='configure-git-modal'>Configure Git Modal</div>
    },
)

jest.mock('components/Error', () => () => null)

jest.mock(
  'components/LoadingScreen',
  () =>
    function () {
      return <div>Loading</div>
    },
)

jest.mock(
  './Base',
  () =>
    function ({ children }: any) {
      return <div>{children}</div>
    },
)

jest.mock('redux/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: () => undefined,
}))

jest.mock('redux/reducers', () => ({
  setError: jest.fn(),
}))

describe('PageLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUseSession.mockReturnValue({
      user: {
        isPlatformAdmin: true,
      },
    })

    mockUseGetGitSettingsQuery.mockReturnValue({
      data: undefined,
    })
  })

  it('shows ConfigureGitModal for platform admins when Git configuration is default', () => {
    mockUseGetGitSettingsQuery.mockReturnValue({
      data: {
        repoUrl: 'http://git-server.git-server.svc.cluster.local/otomi/values.git',
      },
    })

    render(
      <MemoryRouter>
        <PageLayout />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('configure-git-modal')).toBeTruthy()
  })

  it('does not show ConfigureGitModal when Git configuration is external', () => {
    mockUseGetGitSettingsQuery.mockReturnValue({
      data: {
        repoUrl: 'https://github.com/example/values.git',
      },
    })

    render(
      <MemoryRouter>
        <PageLayout />
      </MemoryRouter>,
    )

    expect(screen.queryByTestId('configure-git-modal')).toBeNull()
  })

  it('does not show ConfigureGitModal for non-platform admins', () => {
    mockUseSession.mockReturnValue({
      user: {
        isPlatformAdmin: false,
      },
    })

    mockUseGetGitSettingsQuery.mockReturnValue({
      data: {
        repoUrl: 'http://git-server.git-server.svc.cluster.local/otomi/values.git',
      },
    })

    render(
      <MemoryRouter>
        <PageLayout />
      </MemoryRouter>,
    )

    expect(screen.queryByTestId('configure-git-modal')).toBeNull()
  })

  it('skips fetching Git settings for non-platform admins', () => {
    mockUseSession.mockReturnValue({
      user: {
        isPlatformAdmin: false,
      },
    })

    render(
      <MemoryRouter>
        <PageLayout />
      </MemoryRouter>,
    )

    expect(mockUseGetGitSettingsQuery).toHaveBeenCalledWith(undefined, {
      skip: true,
    })
  })

  it('fetches Git settings for platform admins', () => {
    render(
      <MemoryRouter>
        <PageLayout />
      </MemoryRouter>,
    )

    expect(mockUseGetGitSettingsQuery).toHaveBeenCalledWith(undefined, {
      skip: false,
    })
  })
})
