import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import { useSession } from 'providers/Session'
import palette from 'theme/palette'
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

  it('renders the GitOps card', () => {
    render(
      <MemoryRouter>
        <SettingsOverview />
      </MemoryRouter>,
    )

    expect(screen.getByText('GitOps')).toBeTruthy()
  })

  it('renders normal settings cards as links', () => {
    render(
      <MemoryRouter>
        <SettingsOverview />
      </MemoryRouter>,
    )

    expect(screen.getByText('Cluster').closest('a')?.getAttribute('href')).toBe('/settings/cluster')
    expect(screen.getByText('Platform').closest('a')?.getAttribute('href')).toBe('/settings/platform')
  })

  it.each(['light', 'dark'] as const)('uses theme typography and square surfaces in %s mode', (mode) => {
    const theme = createTheme({
      palette: palette[mode],
      typography: {
        body1: { fontSize: '14px', lineHeight: '20px' },
      },
    })

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <SettingsOverview />
        </MemoryRouter>
      </ThemeProvider>,
    )

    const title = screen.getByText('Cluster')
    expect(title).toHaveStyle({
      color: theme.palette.text.primary,
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '700',
    })
    expect(title.parentElement).toHaveStyle({ borderColor: theme.palette.divider })
    expect(title.parentElement).toHaveStyle({ borderRadius: '0' })
  })

  it('opens GitOps configuration when its card is clicked', () => {
    render(
      <MemoryRouter>
        <SettingsOverview />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('GitOps'))

    expect(screen.getByText('Configure Git Modal Open')).toBeInTheDocument()
    expect(markNewFeatureSeen).toHaveBeenCalledWith('settings-gitops')
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
