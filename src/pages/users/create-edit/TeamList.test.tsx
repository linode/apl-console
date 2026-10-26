import React, { useState } from 'react'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import palette from '../../../theme/palette'
import inputOverrides from '../../../theme/overrides/Input'
import TeamList from './TeamList'

describe.each(['light', 'dark'] as const)('%s TeamList', (mode) => {
  const theme = createTheme({ palette: palette[mode] } as ThemeOptions)
  theme.font = { normal: 'sans-serif', bold: 'sans-serif' }
  theme.components = inputOverrides(theme)

  const setup = (props: Partial<React.ComponentProps<typeof TeamList>> = {}) => {
    const onChange = jest.fn()
    const initialValue = props.value ?? []
    function ControlledTeamList() {
      const [value, setValue] = useState(initialValue)
      return (
        <TeamList
          options={['Alpha', 'Alpine', 'Beta']}
          {...props}
          value={value}
          onChange={(teams) => {
            onChange(teams)
            setValue(teams)
          }}
        />
      )
    }
    render(
      <ThemeProvider theme={theme}>
        <ControlledTeamList />
      </ThemeProvider>,
    )
    return { onChange, user: userEvent.setup() }
  }

  const search = (query: string) => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Search teams' }), { target: { value: query } })
  }

  it('filters using a trimmed, case-insensitive query without changing selection', () => {
    const { onChange } = setup({ value: ['Beta'] })
    search('  ALp  ')
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Alpine' })).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeVisible()
    expect(screen.getByText('Alpine')).toBeVisible()
    expect(screen.queryByRole('checkbox', { name: 'Beta' })).not.toBeInTheDocument()
    search('   ')
    expect(screen.getByRole('checkbox', { name: 'Beta' })).toBeChecked()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('toggles once through the label, full row, checkbox, and keyboard', async () => {
    const { onChange, user } = setup()
    const checkbox = screen.getByRole('checkbox', { name: 'Alpha' })
    await user.click(screen.getByText('Alpha'))
    expect(checkbox).toBeChecked()
    expect(onChange).toHaveBeenNthCalledWith(1, ['Alpha'])
    const row = checkbox.closest('label')
    expect(row).toHaveStyle({ display: 'flex', margin: '0' })
    await user.click(row)
    expect(checkbox).not.toBeChecked()
    expect(onChange).toHaveBeenNthCalledWith(2, [])
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(onChange).toHaveBeenNthCalledWith(3, ['Alpha'])
    checkbox.focus()
    await user.keyboard('[Space]')
    expect(checkbox).not.toBeChecked()
    expect(onChange).toHaveBeenNthCalledWith(4, [])
    expect(onChange).toHaveBeenCalledTimes(4)
  })

  it('selects and clears all teams', async () => {
    const { onChange, user } = setup()
    const all = screen.getByRole('checkbox', { name: 'Select all' })
    await user.click(screen.getByText('Select all'))
    expect(all).toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'false')
    expect(onChange).toHaveBeenLastCalledWith(['Alpha', 'Alpine', 'Beta'])
    await user.click(all)
    expect(all).not.toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it('selects only filtered teams and preserves hidden selections on select and clear', async () => {
    const { onChange, user } = setup({ value: ['Beta', 'Unknown', 'Alpha'] })
    search('alp')
    const all = screen.getByRole('checkbox', { name: 'Select all' })
    expect(all).not.toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'true')
    await user.click(all)
    expect(onChange).toHaveBeenLastCalledWith(['Beta', 'Unknown', 'Alpha', 'Alpine'])
    expect(all).toBeChecked()
    await user.click(all)
    expect(onChange).toHaveBeenLastCalledWith(['Beta', 'Unknown'])
    expect(all).not.toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'false')
    search('')
    expect(screen.getByRole('checkbox', { name: 'Beta' })).toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'true')
  })

  it.each([
    { value: ['Unknown', 'Other', 'Missing'], checked: false, partial: false },
    { value: ['Alpha', 'Unknown', 'Other'], checked: false, partial: true },
    { value: ['Alpha', 'Alpha', 'Alpha'], checked: false, partial: true },
    { value: ['Alpha', 'Alpine', 'Beta', 'Unknown'], checked: true, partial: false },
  ])('calculates all/partial membership for $value', ({ value, checked, partial }) => {
    setup({ value })
    const all = screen.getByRole('checkbox', { name: 'Select all' })
    expect((all as HTMLInputElement).checked).toBe(checked)
    expect(all).toHaveAttribute('data-indeterminate', String(partial))
  })

  it('ignores hidden selections when calculating the filtered selection state', () => {
    setup({ value: ['Beta'] })
    search('alp')
    const all = screen.getByRole('checkbox', { name: 'Select all' })
    expect(all).not.toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'false')
    search('beta')
    expect(all).toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'false')
  })

  it('deduplicates options and select-all output', async () => {
    const { onChange, user } = setup({ options: ['Alpha', 'Alpha', 'Beta', 'Beta'], value: ['Alpha', 'Alpha'] })
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
    const all = screen.getByRole('checkbox', { name: 'Select all' })
    expect(all).not.toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'true')
    await user.click(all)
    expect(onChange).toHaveBeenLastCalledWith(['Alpha', 'Beta'])
    expect(all).toBeChecked()
    await user.click(all)
    expect(onChange).toHaveBeenLastCalledWith([])
  })

  it('removes every duplicate membership when a team is toggled off', async () => {
    const { onChange, user } = setup({ value: ['Alpha', 'Beta', 'Alpha'] })
    await user.click(screen.getByRole('checkbox', { name: 'Alpha' }))
    expect(onChange).toHaveBeenCalledWith(['Beta'])
  })

  it('disables search and every checkbox without firing callbacks and explains the bypass', async () => {
    const helperText = 'Platform administrators have access to all teams.'
    const { onChange, user } = setup({ disabled: true, helperText, value: ['Alpha'] })
    const input = screen.getByRole('textbox', { name: 'Search teams' })
    expect(input).toBeDisabled()
    await user.type(input, 'Beta')
    expect(input).toHaveValue('')
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((checkbox) => expect(checkbox).toBeDisabled())
    await user.click(screen.getByText('Select all'))
    await user.click(screen.getByText('Alpha'))
    await user.click(screen.getByText('Beta'))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Beta' }))
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked()
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('group', { name: 'Team selection' })).toHaveAccessibleDescription(helperText)
    expect(screen.getByText(helperText)).toHaveStyle({ color: theme.palette.text.secondary })
  })

  it('renders optional helper text even when enabled', () => {
    setup({ helperText: 'Choose the teams this user can access.' })
    expect(screen.getByText('Choose the teams this user can access.')).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Search teams' })).toBeEnabled()
  })

  it('shows the empty options message and prevents select-all callbacks', async () => {
    const { onChange, user } = setup({ options: [], value: ['Unknown'] })
    expect(screen.getByText('No teams available')).toBeVisible()
    expect(screen.queryByText('No teams found')).not.toBeInTheDocument()
    const all = screen.getByRole('checkbox', { name: 'Select all' })
    expect(all).not.toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'false')
    expect(all).toBeDisabled()
    await user.click(screen.getByText('Select all'))
    search('anything')
    expect(screen.getByText('No teams available')).toBeVisible()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows no matches without losing selections or allowing select-all callbacks', async () => {
    const { onChange, user } = setup({ value: ['Alpha'] })
    search('nonexistent')
    expect(screen.getByText('No teams found')).toBeVisible()
    expect(screen.queryByText('No teams available')).not.toBeInTheDocument()
    const all = screen.getByRole('checkbox', { name: 'Select all' })
    expect(all).toBeDisabled()
    expect(all).not.toBeChecked()
    expect(all).toHaveAttribute('data-indeterminate', 'false')
    await user.click(screen.getByText('Select all'))
    expect(onChange).not.toHaveBeenCalled()
    search('')
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked()
  })

  it('constrains the responsive search and list and scrolls only the list body', () => {
    setup()
    const group = screen.getByRole('group', { name: 'Team selection' })
    expect(group).toHaveStyle({ maxWidth: '420px', width: '100%' })
    expect(group).not.toHaveAttribute('aria-describedby')
    const input = screen.getByRole('textbox', { name: 'Search teams' })
    expect(group).toContainElement(input)
    expect(input.closest('.MuiFormControl-root')).toHaveStyle({ width: '100%' })
    const body = screen.getByRole('checkbox', { name: 'Alpha' }).closest('label').parentElement
    expect(body).toHaveStyle({ maxHeight: '320px', overflowY: 'auto' })
    const all = screen.getByRole('checkbox', { name: 'Select all' })
    expect(body).not.toContainElement(all)
    expect(body.parentElement).toContainElement(all)
    expect(body.parentElement).not.toHaveStyle({ overflowY: 'auto' })
    expect(body.parentElement).toHaveStyle({
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: theme.palette.cm.textBox,
      borderColor: theme.palette.cm.textBoxBorder,
    })
  })
})
