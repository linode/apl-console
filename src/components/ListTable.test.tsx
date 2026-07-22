import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ListTable from './ListTable'

const mockEnhancedTable = jest.fn()

jest.mock('providers/Session', () => ({
  useSession: () => ({
    user: {
      isPlatformAdmin: false,
    },
    oboTeamId: undefined,
  }),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

jest.mock('./HeaderTitle', () => ({
  __esModule: true,
  default: function MockHeaderTitle({ title }: { title: string }) {
    return <h1>{title}</h1>
  },
}))

jest.mock('components/forms/TextField', () => ({
  TextField: function MockTextField({
    label,
    value,
    onChange,
    disabled,
    children,
    helperText,
  }: {
    label: string
    value: string
    onChange: React.ChangeEventHandler<HTMLSelectElement>
    disabled?: boolean
    children: React.ReactNode
    helperText?: React.ReactNode
  }) {
    return (
      <div>
        <label htmlFor='dropdown-filter'>{label}</label>

        <select id='dropdown-filter' aria-label={label} value={value} onChange={onChange} disabled={disabled}>
          {children}
        </select>

        {helperText && <span>{helperText}</span>}
      </div>
    )
  },
}))

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material')

  return {
    ...actual,
    MenuItem: function MockMenuItem({ value, children }: { value: string; children: React.ReactNode }) {
      return <option value={value}>{children}</option>
    },
  }
})

jest.mock('./EnhancedTable', () => ({
  __esModule: true,
  default: function MockEnhancedTable({ rows }: { rows: Array<{ name: string }> }) {
    mockEnhancedTable({ rows })

    return (
      <div>
        {rows.map((row) => (
          <div key={row.name}>{row.name}</div>
        ))}
      </div>
    )
  },
}))

const rows = [
  {
    name: 'secret-a-1',
    metadata: {
      namespace: 'namespace-a',
    },
  },
  {
    name: 'secret-a-2',
    metadata: {
      namespace: 'namespace-a',
    },
  },
  {
    name: 'secret-b-1',
    metadata: {
      namespace: 'namespace-b',
    },
  },
]

const headCells = [
  {
    id: 'name',
    label: 'Name',
  },
] as any

type ListTableProps = React.ComponentProps<typeof ListTable>

const renderListTable = (props: Partial<ListTableProps> = {}) =>
  render(<ListTable resourceType='secret' headCells={headCells} rows={rows} {...props} />)

describe('ListTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows every row when dropdown filtering is disabled', () => {
    renderListTable()

    expect(screen.getByText('secret-a-1')).toBeInTheDocument()
    expect(screen.getByText('secret-a-2')).toBeInTheDocument()
    expect(screen.getByText('secret-b-1')).toBeInTheDocument()
  })

  it('does not show the dropdown when filtering is disabled', () => {
    renderListTable()

    expect(screen.queryByLabelText('Namespace')).not.toBeInTheDocument()
  })

  it('selects the first dropdown item by default', async () => {
    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterLabel: 'Namespace',
      dropdownFilterItems: ['namespace-a', 'namespace-b'],
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Namespace')).toHaveValue('namespace-a')
    })
  })

  it('only shows rows belonging to the first namespace', async () => {
    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterLabel: 'Namespace',
      dropdownFilterItems: ['namespace-a', 'namespace-b'],
    })

    await waitFor(() => {
      expect(screen.getByText('secret-a-1')).toBeInTheDocument()
    })

    expect(screen.getByText('secret-a-2')).toBeInTheDocument()

    expect(screen.queryByText('secret-b-1')).not.toBeInTheDocument()
  })

  it('updates filtered rows when the namespace changes', async () => {
    const user = userEvent.setup()

    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterLabel: 'Namespace',
      dropdownFilterItems: ['namespace-a', 'namespace-b'],
    })

    await user.selectOptions(screen.getByLabelText('Namespace'), 'namespace-b')

    expect(screen.getByText('secret-b-1')).toBeInTheDocument()

    expect(screen.queryByText('secret-a-1')).not.toBeInTheDocument()

    expect(screen.queryByText('secret-a-2')).not.toBeInTheDocument()
  })

  it('calls onDropdownFilterChange in controlled mode', async () => {
    const user = userEvent.setup()
    const onDropdownFilterChange = jest.fn()

    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterLabel: 'Namespace',
      dropdownFilterItems: ['namespace-a', 'namespace-b'],
      dropdownFilterValue: 'namespace-a',
      onDropdownFilterChange,
    })

    await user.selectOptions(screen.getByLabelText('Namespace'), 'namespace-b')

    expect(onDropdownFilterChange).toHaveBeenCalledWith('namespace-b')
  })

  it('requests the first namespace when controlled value is empty', async () => {
    const onDropdownFilterChange = jest.fn()

    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterItems: ['namespace-a', 'namespace-b'],
      dropdownFilterValue: '',
      onDropdownFilterChange,
    })

    await waitFor(() => {
      expect(onDropdownFilterChange).toHaveBeenCalledWith('namespace-a')
    })
  })

  it('does not overwrite an existing controlled value', () => {
    const onDropdownFilterChange = jest.fn()

    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterItems: ['namespace-a', 'namespace-b'],
      dropdownFilterValue: 'namespace-b',
      onDropdownFilterChange,
    })

    expect(onDropdownFilterChange).not.toHaveBeenCalled()

    expect(screen.getByText('secret-b-1')).toBeInTheDocument()
  })

  it('disables the filter when there are no dropdown items', () => {
    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterLabel: 'Namespace',
      dropdownFilterItems: [],
    })

    expect(screen.getByLabelText('Namespace')).toBeDisabled()

    expect(screen.getByText('No secrets available in namespace')).toBeInTheDocument()
  })

  it('shows no rows before a controlled filter value is selected', () => {
    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterLabel: 'Namespace',
      dropdownFilterItems: [],
      dropdownFilterValue: '',
      onDropdownFilterChange: jest.fn(),
    })

    expect(screen.queryByText('secret-a-1')).not.toBeInTheDocument()

    expect(screen.queryByText('secret-a-2')).not.toBeInTheDocument()

    expect(screen.queryByText('secret-b-1')).not.toBeInTheDocument()
  })

  it('uses the configured dropdown accessor', async () => {
    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterLabel: 'Team',
      dropdownFilterItems: ['team-a', 'team-b'],
      dropdownFilterAccessor: (row) => row.team,
      rows: [
        {
          name: 'team-a-secret',
          team: 'team-a',
        },
        {
          name: 'team-b-secret',
          team: 'team-b',
        },
      ],
    })

    await waitFor(() => {
      expect(screen.getByText('team-a-secret')).toBeInTheDocument()
    })

    expect(screen.queryByText('team-b-secret')).not.toBeInTheDocument()
  })

  it('passes filtered rows to EnhancedTable', async () => {
    renderListTable({
      hasDropdownFilter: true,
      dropdownFilterItems: ['namespace-a', 'namespace-b'],
    })

    await waitFor(() => {
      expect(mockEnhancedTable).toHaveBeenLastCalledWith({
        rows: [
          {
            name: 'secret-a-1',
            metadata: {
              namespace: 'namespace-a',
            },
          },
          {
            name: 'secret-a-2',
            metadata: {
              namespace: 'namespace-a',
            },
          },
        ],
      })
    })
  })
})
