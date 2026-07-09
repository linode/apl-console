import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { useSession } from 'providers/Session'
import { useGetGitSettingsQuery } from 'redux/otomiApi'
import Manifests from './Manifests'

jest.mock('providers/Session', () => ({
  useSession: jest.fn(),
}))

jest.mock('redux/otomiApi', () => ({
  useGetGitSettingsQuery: jest.fn(),
}))

jest.mock(
  'layouts/Paper',
  () =>
    function ({ children, title }: any) {
      return (
        <div>
          <h1>{title}</h1>
          {children}
        </div>
      )
    },
)

jest.mock('components/LandingHeader', () => ({
  LandingHeader: ({ title }: any) => <h2>{title}</h2>,
}))

jest.mock(
  'components/Section',
  () =>
    function ({ children }: any) {
      return <section>{children}</section>
    },
)

const mockUseSession = useSession as jest.Mock
const mockUseGetGitSettingsQuery = useGetGitSettingsQuery as jest.Mock
const writeTextMock = jest.fn()

describe('Manifests', () => {
  beforeEach(() => {
    writeTextMock.mockClear()

    mockUseSession.mockReturnValue({
      user: { isPlatformAdmin: true },
      settings: {
        cluster: {
          domainSuffix: 'example.com',
        },
      },
    })

    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('copies the values repository URL', () => {
    mockUseGetGitSettingsQuery.mockReturnValue({
      data: {
        repoUrl: 'https://github.com/example/values.git',
        branch: 'main',
      },
    })

    render(<Manifests />)

    fireEvent.click(screen.getByRole('button', { name: /copy values repository url/i }))

    expect(writeTextMock).toHaveBeenCalledWith('https://github.com/example/values.git')
  })

  it('skips loading Git settings when user is not platform admin', () => {
    mockUseSession.mockReturnValue({
      user: { isPlatformAdmin: false },
      settings: {
        cluster: {
          domainSuffix: 'example.com',
        },
      },
    })

    mockUseGetGitSettingsQuery.mockReturnValue({ data: undefined })

    render(<Manifests />)

    expect(mockUseGetGitSettingsQuery.mock.calls[0]).toEqual([undefined, { skip: true }])
  })
})
