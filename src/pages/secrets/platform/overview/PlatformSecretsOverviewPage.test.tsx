import { act, render } from '@testing-library/react'
import React from 'react'
import { useSession } from 'providers/Session'
import { useSocket } from 'providers/Socket'
import { useAppSelector } from 'redux/hooks'
import { useGetAplNamespaceSealedSecretsQuery, useGetNamespacesWithSealedSecretsQuery } from 'redux/otomiApi'
import ListTable from 'components/ListTable'
import SecretOverviewPage from './PlatformSecretOverviewPage'

jest.mock('@iconify/react', () => ({
  Icon: () => null,
}))

jest.mock('providers/Session', () => ({
  useSession: jest.fn(),
}))

jest.mock('providers/Socket', () => ({
  useSocket: jest.fn(),
}))

jest.mock('redux/hooks', () => ({
  useAppSelector: jest.fn(),
}))

jest.mock('redux/otomiApi', () => ({
  useGetNamespacesWithSealedSecretsQuery: jest.fn(),
  useGetAplNamespaceSealedSecretsQuery: jest.fn(),
}))

jest.mock('components/ListTable', () => jest.fn(() => null))

jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ comp }: { comp: React.ReactNode }) => comp,
}))

jest.mock('components/InformationBanner', () => ({
  __esModule: true,
  default: ({ message, children }: { message: React.ReactNode; children?: React.ReactNode }) => (
    <div>
      {message}
      {children}
    </div>
  ),
}))

jest.mock('components/MuiLink', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

jest.mock('components/Link', () => ({
  __esModule: true,
  default: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
}))

jest.mock('components/Workloads', () => ({
  getStatus: jest.fn(),
}))

const mockedUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockedUseSocket = useSocket as jest.MockedFunction<typeof useSocket>
const mockedUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>

const mockedUseGetNamespacesWithSealedSecretsQuery = useGetNamespacesWithSealedSecretsQuery as jest.MockedFunction<
  typeof useGetNamespacesWithSealedSecretsQuery
>

const mockedUseGetAplNamespaceSealedSecretsQuery = useGetAplNamespaceSealedSecretsQuery as jest.MockedFunction<
  typeof useGetAplNamespaceSealedSecretsQuery
>

const mockedListTable = ListTable as jest.MockedFunction<typeof ListTable>

const mockRefetch = jest.fn()

const sealedSecrets = [
  {
    metadata: {
      name: 'secret-one',
      namespace: 'team-alpha',
      labels: {
        'apl.io/teamId': 'alpha',
      },
    },
    spec: {
      template: {
        type: 'Opaque',
        metadata: {
          namespace: 'team-alpha',
        },
      },
    },
  },
]

describe('SecretOverviewPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedUseSession.mockReturnValue({
      oboTeamId: 'alpha',
      user: {
        isPlatformAdmin: false,
      },
    } as unknown as ReturnType<typeof useSession>)

    mockedUseSocket.mockReturnValue({
      statuses: {},
    } as unknown as ReturnType<typeof useSocket>)

    mockedUseAppSelector.mockReturnValue(true)

    mockedUseGetNamespacesWithSealedSecretsQuery.mockReturnValue({
      data: ['team-alpha', 'team-beta'],
      isLoading: false,
    } as unknown as ReturnType<typeof useGetNamespacesWithSealedSecretsQuery>)

    mockedUseGetAplNamespaceSealedSecretsQuery.mockReturnValue({
      data: sealedSecrets,
      isLoading: false,
      isFetching: false,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useGetAplNamespaceSealedSecretsQuery>)
  })

  it('selects the first namespace by default', () => {
    render(<SecretOverviewPage />)

    expect(mockedUseGetAplNamespaceSealedSecretsQuery).toHaveBeenLastCalledWith(
      {
        namespace: 'team-alpha',
      },
      {
        skip: false,
      },
    )

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    expect(props.dropdownFilterValue).toBe('team-alpha')
    expect(props.dropdownFilterItems).toEqual(['team-alpha', 'team-beta'])
  })

  it('passes sealed secrets for the selected namespace to the table', () => {
    render(<SecretOverviewPage />)

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    expect(props.rows).toEqual(sealedSecrets)
    expect(props.resourceType).toBe('Secret')
  })

  it('configures the namespace dropdown filter', () => {
    render(<SecretOverviewPage />)

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    expect(props.hasDropdownFilter).toBe(true)
    expect(props.dropdownFilterLabel).toBe('Namespace')
    expect(props.dropdownFilterItems).toEqual(['team-alpha', 'team-beta'])
    expect(props.dropdownFilterValue).toBe('team-alpha')
  })

  it('changes namespace when the dropdown selection changes', () => {
    render(<SecretOverviewPage />)

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    act(() => {
      props.onDropdownFilterChange('team-beta')
    })

    expect(mockedUseGetAplNamespaceSealedSecretsQuery).toHaveBeenLastCalledWith(
      {
        namespace: 'team-beta',
      },
      {
        skip: false,
      },
    )

    const updatedProps = mockedListTable.mock.calls.at(-1)?.[0]

    expect(updatedProps.dropdownFilterValue).toBe('team-beta')
  })

  it('uses the template namespace for filtering when available', () => {
    render(<SecretOverviewPage />)

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    expect(props.dropdownFilterAccessor(sealedSecrets[0])).toBe('team-alpha')
  })

  it('falls back to metadata namespace for filtering', () => {
    render(<SecretOverviewPage />)

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    const row = {
      metadata: {
        namespace: 'fallback-namespace',
      },
      spec: {
        template: {},
      },
    }

    expect(props.dropdownFilterAccessor(row)).toBe('fallback-namespace')
  })

  it('shows the disaster recovery banner for platform admins', () => {
    mockedUseSession.mockReturnValue({
      oboTeamId: 'admin',
      user: {
        isPlatformAdmin: true,
      },
    } as unknown as ReturnType<typeof useSession>)

    const { getByText, getByRole } = render(<SecretOverviewPage />)

    expect(
      getByText('Please make sure to download encryption keys for the disaster recovery purpose.'),
    ).toBeInTheDocument()

    expect(getByRole('link', { name: 'Download Keys' })).toHaveAttribute('href', '/api/v2/sealedsecretskeys')
  })

  it('does not show the disaster recovery banner for team users', () => {
    const { queryByText } = render(<SecretOverviewPage />)

    expect(
      queryByText('Please make sure to download encryption keys for the disaster recovery purpose.'),
    ).not.toBeInTheDocument()
  })

  it('links a secret when the user owns the team', () => {
    render(<SecretOverviewPage />)

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    const nameColumn = props.headCells.find((cell) => cell.id === 'metadata.name')

    const rendered = render(<>{nameColumn.renderer(sealedSecrets[0])}</>)

    const link = rendered.getByRole('link', {
      name: 'secret-one',
    })

    expect(link).toHaveAttribute('href', '/secrets/team-alpha/secret-one')
  })

  it('does not link a secret owned by another team', () => {
    render(<SecretOverviewPage />)

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    const nameColumn = props.headCells.find((cell) => cell.id === 'metadata.name')

    const otherTeamSecret = {
      ...sealedSecrets[0],
      metadata: {
        ...sealedSecrets[0].metadata,
        labels: {
          'apl.io/teamId': 'beta',
        },
      },
    }

    const rendered = render(<>{nameColumn.renderer(otherTeamSecret)}</>)

    expect(
      rendered.queryByRole('link', {
        name: 'secret-one',
      }),
    ).not.toBeInTheDocument()

    expect(rendered.getByText('secret-one')).toBeInTheDocument()
  })

  it('allows platform admins to open secrets from any team', () => {
    mockedUseSession.mockReturnValue({
      oboTeamId: 'admin',
      user: {
        isPlatformAdmin: true,
      },
    } as unknown as ReturnType<typeof useSession>)

    render(<SecretOverviewPage />)

    const props = mockedListTable.mock.calls.at(-1)?.[0]

    const nameColumn = props.headCells.find((cell) => cell.id === 'metadata.name')

    const otherTeamSecret = {
      ...sealedSecrets[0],
      metadata: {
        ...sealedSecrets[0].metadata,
        labels: {
          'apl.io/teamId': 'beta',
        },
      },
    }

    const rendered = render(<>{nameColumn.renderer(otherTeamSecret)}</>)

    expect(
      rendered.getByRole('link', {
        name: 'secret-one',
      }),
    ).toHaveAttribute('href', '/secrets/team-alpha/secret-one')
  })

  it('does not refetch while namespace secrets are already fetching', () => {
    mockedUseAppSelector.mockReturnValue(false)

    mockedUseGetAplNamespaceSealedSecretsQuery.mockReturnValue({
      data: sealedSecrets,
      isLoading: false,
      isFetching: true,
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useGetAplNamespaceSealedSecretsQuery>)

    render(<SecretOverviewPage />)

    expect(mockRefetch).not.toHaveBeenCalled()
  })
})
