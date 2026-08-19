import { render } from '@testing-library/react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from 'providers/Session'
import { useSocket } from 'providers/Socket'
import useSettings from 'hooks/useSettings'
import { useAppSelector } from 'redux/hooks'
import { useGetAllAplBuildsQuery, useGetTeamAplBuildsQuery } from 'redux/otomiApi'
import ListTable from 'components/ListTable'
import BuildsOverviewPage from './BuildsOverviewPage'

jest.mock('@iconify/react', () => ({
  Icon: () => null,
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}))

jest.mock('providers/Session', () => ({
  useSession: jest.fn(),
}))

jest.mock('providers/Socket', () => ({
  useSocket: jest.fn(),
}))

jest.mock('hooks/useSettings', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('redux/hooks', () => ({
  useAppSelector: jest.fn(),
}))

jest.mock('redux/otomiApi', () => ({
  useGetAllAplBuildsQuery: jest.fn(),
  useGetTeamAplBuildsQuery: jest.fn(),
}))

jest.mock('components/ListTable', () => jest.fn(() => null))

jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ comp }: { comp: React.ReactNode }) => comp,
}))

jest.mock('components/InformationBanner', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('components/CopyToClipboard', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('pages/workloads/overview/WorkloadsOverviewPage', () => ({
  getStatus: jest.fn(),
}))

jest.mock('components/MuiLink', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}))

jest.mock('../../../components/Link', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}))

const mockedUseHistory = useHistory as jest.MockedFunction<typeof useHistory>
const mockedUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockedUseSocket = useSocket as jest.MockedFunction<typeof useSocket>
const mockedUseSettings = useSettings as jest.MockedFunction<typeof useSettings>
const mockedUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>

const mockedUseGetAllAplBuildsQuery = useGetAllAplBuildsQuery as jest.MockedFunction<typeof useGetAllAplBuildsQuery>

const mockedUseGetTeamAplBuildsQuery = useGetTeamAplBuildsQuery as jest.MockedFunction<typeof useGetTeamAplBuildsQuery>

const mockedListTable = ListTable as jest.MockedFunction<typeof ListTable>

const mockPush = jest.fn()
const mockRefetchAllBuilds = jest.fn()
const mockRefetchTeamBuilds = jest.fn()
const mockOnToggleView = jest.fn()

const renderPage = (teamId?: string) =>
  render(
    <BuildsOverviewPage
      match={
        {
          params: {
            teamId,
          },
        } as any
      }
      history={undefined}
      location={undefined}
    />,
  )

describe('BuildsOverviewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedUseHistory.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useHistory>)

    mockedUseSession.mockReturnValue({
      appsEnabled: {
        tekton: true,
        harbor: true,
      },
      user: {
        isPlatformAdmin: false,
      },
      settings: {
        cluster: {
          domainSuffix: 'example.com',
        },
      },
    } as unknown as ReturnType<typeof useSession>)

    mockedUseSocket.mockReturnValue({
      statuses: {},
    } as unknown as ReturnType<typeof useSocket>)

    mockedUseSettings.mockReturnValue({
      onToggleView: mockOnToggleView,
    } as unknown as ReturnType<typeof useSettings>)

    mockedUseAppSelector.mockReturnValue(true)

    mockedUseGetAllAplBuildsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetchAllBuilds,
    } as unknown as ReturnType<typeof useGetAllAplBuildsQuery>)

    mockedUseGetTeamAplBuildsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: mockRefetchTeamBuilds,
    } as unknown as ReturnType<typeof useGetTeamAplBuildsQuery>)
  })

  it('uses imageName as the sortable field for the Repository column', () => {
    renderPage('alpha')

    expect(mockedListTable).toHaveBeenCalled()

    const { headCells } = mockedListTable.mock.calls[0][0]

    const repositoryColumn = headCells.find((cell) => cell.label === 'Repository')

    expect(repositoryColumn).toBeDefined()
    expect(repositoryColumn?.id).toBe('spec.imageName')
  })

  it('passes team builds to the table when a teamId is provided', () => {
    const teamBuilds = [
      {
        metadata: {
          name: 'build-one',
          labels: {
            'apl.io/teamId': 'alpha',
          },
        },
        spec: {
          imageName: 'banana',
          tag: 'latest',
          mode: {
            type: 'docker',
          },
        },
      },
    ]

    mockedUseGetTeamAplBuildsQuery.mockReturnValue({
      data: teamBuilds,
      isLoading: false,
      isFetching: false,
      refetch: mockRefetchTeamBuilds,
    } as unknown as ReturnType<typeof useGetTeamAplBuildsQuery>)

    renderPage('alpha')

    const props = mockedListTable.mock.calls[0][0]

    expect(props.teamId).toBe('alpha')
    expect(props.rows).toEqual(teamBuilds)
  })

  it('passes all builds to the table when no teamId is provided', () => {
    const allBuilds = [
      {
        metadata: {
          name: 'build-one',
          labels: {
            'apl.io/teamId': 'alpha',
          },
        },
        spec: {
          imageName: 'banana',
        },
      },
      {
        metadata: {
          name: 'build-two',
          labels: {
            'apl.io/teamId': 'beta',
          },
        },
        spec: {
          imageName: 'apple',
        },
      },
    ]

    mockedUseGetAllAplBuildsQuery.mockReturnValue({
      data: allBuilds,
      isLoading: false,
      isFetching: false,
      refetch: mockRefetchAllBuilds,
    } as unknown as ReturnType<typeof useGetAllAplBuildsQuery>)

    renderPage()

    const props = mockedListTable.mock.calls[0][0]

    expect(props.teamId).toBeUndefined()
    expect(props.rows).toEqual(allBuilds)
  })

  it('adds the Team column when viewing all builds', () => {
    renderPage()

    const { headCells } = mockedListTable.mock.calls[0][0]

    expect(headCells).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'metadata.labels.apl.io/teamId',
          label: 'Team',
        }),
      ]),
    )
  })

  it('does not add the Team column when viewing a specific team', () => {
    renderPage('alpha')

    const { headCells } = mockedListTable.mock.calls[0][0]

    expect(headCells.find((cell) => cell.id === 'metadata.labels.apl.io/teamId')).toBeUndefined()
  })

  it('disables container image creation when Tekton is disabled', () => {
    mockedUseSession.mockReturnValue({
      appsEnabled: {
        tekton: false,
        harbor: true,
      },
      user: {
        isPlatformAdmin: false,
      },
      settings: {
        cluster: {
          domainSuffix: 'example.com',
        },
      },
    } as unknown as ReturnType<typeof useSession>)

    renderPage('alpha')

    const props = mockedListTable.mock.calls[0][0]

    expect(props.createButtonDisabled).toBe(true)
    expect(props.rows).toEqual([])
  })

  it('disables container image creation when Harbor is disabled', () => {
    mockedUseSession.mockReturnValue({
      appsEnabled: {
        tekton: true,
        harbor: false,
      },
      user: {
        isPlatformAdmin: false,
      },
      settings: {
        cluster: {
          domainSuffix: 'example.com',
        },
      },
    } as unknown as ReturnType<typeof useSession>)

    renderPage('alpha')

    const props = mockedListTable.mock.calls[0][0]

    expect(props.createButtonDisabled).toBe(true)
    expect(props.rows).toEqual([])
  })
})
