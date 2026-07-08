import { useSession } from 'providers/Session'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { canDo } from 'utils/permission'
import { markNewFeatureSeen } from 'utils/newFeaturesCookieManager'
import NavConfig from './NavConfig'

jest.mock('providers/Session', () => ({
  useSession: jest.fn(),
}))

jest.mock('hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}))

jest.mock('utils/permission', () => ({
  canDo: jest.fn(),
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

jest.mock('generate-download-link', () => ({
  __esModule: true,
  default: jest.fn(() => 'download-link'),
}))

type NavConfigTestItem = {
  title: string
  path?: string
  info?: unknown
  hidden?: boolean
  disabled?: boolean
  isDownload?: boolean
  onClick?: () => void
}

const mockUseSession = useSession as jest.Mock
const mockUseLocalStorage = useLocalStorage as jest.Mock
const mockCanDo = canDo as jest.Mock
const mockMarkNewFeatureSeen = markNewFeatureSeen as jest.Mock

const getPlatformItems = (): NavConfigTestItem[] => NavConfig()[0].items as NavConfigTestItem[]
const getTeamItems = (): NavConfigTestItem[] => NavConfig()[1].items as NavConfigTestItem[]
const getAccessItems = (): NavConfigTestItem[] => NavConfig()[2].items as NavConfigTestItem[]

describe('NavConfig', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      ca: 'ca-content',
      appsEnabled: {
        harbor: true,
      },
      oboTeamId: 'team-a',
      user: {
        isPlatformAdmin: true,
        isTeamAdmin: false,
      },
      settings: {
        otomi: {
          hasExternalIDP: false,
          isPreInstalled: false,
        },
        cluster: {
          apiServer: true,
        },
      },
    })

    mockUseLocalStorage.mockReturnValue([undefined])
    mockCanDo.mockReturnValue(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('adds the Manifests item to the platform menu with a new feature handler', () => {
    const manifestsItem = getPlatformItems().find((item) => item.title === 'Manifests')

    expect(manifestsItem?.path).toBe('/manifests')
    expect(manifestsItem?.info).toBeTruthy()

    manifestsItem?.onClick?.()

    expect(mockMarkNewFeatureSeen).toHaveBeenCalledWith('platform-manifests')
  })

  it('adds new feature handlers for platform Catalogs, Secrets, and Settings', () => {
    const platformItems = getPlatformItems()

    platformItems.find((item) => item.title === 'Catalogs')?.onClick?.()
    platformItems.find((item) => item.title === 'Secrets')?.onClick?.()
    platformItems.find((item) => item.title === 'Settings')?.onClick?.()

    expect(mockMarkNewFeatureSeen).toHaveBeenCalledWith('platform-catalogs')
    expect(mockMarkNewFeatureSeen).toHaveBeenCalledWith('platform-secrets')
    expect(mockMarkNewFeatureSeen).toHaveBeenCalledWith('platform-settings')
  })

  it('uses the session obo team id for team paths', () => {
    const teamItems = getTeamItems()

    expect(teamItems.find((item) => item.title === 'Apps')?.path).toBe('/apps/team-a')
    expect(teamItems.find((item) => item.title === 'Code Repositories')?.path).toBe('/teams/team-a/code-repositories')
  })

  it('falls back to local storage obo team id when session obo team id is missing', () => {
    mockUseSession.mockReturnValue({
      ca: 'ca-content',
      appsEnabled: {
        harbor: true,
      },
      oboTeamId: undefined,
      user: {
        isPlatformAdmin: true,
        isTeamAdmin: false,
      },
      settings: {
        otomi: {
          hasExternalIDP: false,
          isPreInstalled: false,
        },
        cluster: {
          apiServer: true,
        },
      },
    })

    mockUseLocalStorage.mockReturnValue(['team-b'])

    const teamItems = getTeamItems()

    expect(teamItems.find((item) => item.title === 'Apps')?.path).toBe('/apps/team-b')
  })

  it('hides platform user management when external IDP is enabled', () => {
    mockUseSession.mockReturnValue({
      ca: 'ca-content',
      appsEnabled: {
        harbor: true,
      },
      oboTeamId: 'team-a',
      user: {
        isPlatformAdmin: true,
        isTeamAdmin: false,
      },
      settings: {
        otomi: {
          hasExternalIDP: true,
          isPreInstalled: false,
        },
        cluster: {
          apiServer: true,
        },
      },
    })

    const userManagementItem = getPlatformItems().find((item) => item.title === 'User Management')

    expect(userManagementItem?.hidden).toBe(true)
  })

  it('disables access downloads based on permissions and config', () => {
    mockCanDo.mockReturnValue(false)

    const accessItems = getAccessItems()

    expect(accessItems.find((item) => item.title === 'Download KUBECFG')?.disabled).toBe(true)
    expect(accessItems.find((item) => item.title === 'Download DOCKERCFG')?.disabled).toBe(true)
    expect(accessItems.find((item) => item.title === 'Download CA')?.disabled).toBe(true)
  })
})
