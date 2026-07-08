import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useSession } from 'providers/Session'
import { markNewFeatureSeen } from 'utils/newFeaturesCookieManager'
import SettingsOverview from './SettingsOverview'

jest.mock('providers/Session', () => ({
  useSession: jest.fn(),
}))

jest.mock('utils/newFeaturesCookieManager', () => ({
  markNewFeatureSeen: jest.fn(),
}))

jest.mock('components/SvgIconStyle', () => () => null)
jest.mock(
  'components/NewFeatureChip',
  () =>
    function ({ feature }: { feature: string }) {
      return <span>{feature}</span>
    },
)
jest.mock(
  'components/Versions',
  () =>
    function () {
      return <div>Versions</div>
    },
)

jest.mock(
  'components/modals/ConfigureGitModal',
  () =>
    function ({ open }: { open: boolean }) {
      return open ? <div>Configure Git Modal Open</div> : <div>Configure Git Modal Closed</div>
    },
)

jest.mock(
  'layouts/Paper',
  () =>
    function ({ comp }: any) {
      return <div>{comp}</div>
    },
)

const mockUseSession = useSession as jest.Mock
const mockMarkNewFeatureSeen = markNewFeatureSeen as jest.Mock

describe('SettingsOverview', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      settings: {
        otomi: {
          isPreInstalled: false,
        },
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the GitOps card with a new feature chip', () => {
    render(
      <MemoryRouter>
        <SettingsOverview />
      </MemoryRouter>,
    )

    expect(screen.getByText('GitOps')).toBeTruthy()
    expect(screen.getByText('settings-gitops')).toBeTruthy()
  })

  it('marks GitOps as seen and opens the Git modal when clicked', () => {
    render(
      <MemoryRouter>
        <SettingsOverview />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('GitOps'))

    expect(mockMarkNewFeatureSeen).toHaveBeenCalledWith('settings-gitops')
    expect(screen.getByText('Configure Git Modal Open')).toBeTruthy()
  })

  it('renders normal settings cards as links', () => {
    render(
      <MemoryRouter>
        <SettingsOverview />
      </MemoryRouter>,
    )

    expect(screen.getByText('Cluster').closest('a')?.getAttribute('href')).toBe('/settings/cluster')
    expect(screen.getByText('Platform').closest('a')?.getAttribute('href')).toBe('/settings/otomi')
  })

  it('hides pre-installed specific settings when platform is pre-installed', () => {
    mockUseSession.mockReturnValue({
      settings: {
        otomi: {
          isPreInstalled: true,
        },
      },
    })

    render(
      <MemoryRouter>
        <SettingsOverview />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Secrets')).toBeNull()
    expect(screen.queryByText('DNS')).toBeNull()
    expect(screen.queryByText('Ingress')).toBeNull()
  })

  it('shows pre-installed specific settings when platform is not pre-installed', () => {
    render(
      <MemoryRouter>
        <SettingsOverview />
      </MemoryRouter>,
    )

    expect(screen.getByText('Secrets')).toBeTruthy()
    expect(screen.getByText('DNS')).toBeTruthy()
    expect(screen.getByText('Ingress')).toBeTruthy()
  })
})
