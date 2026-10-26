import React, { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import palette from '../../../theme/palette'
import inputOverrides from '../../../theme/overrides/Input'
import AccessManagement from './AccessManagement'
import type { AccessLevel } from './user-create-edit.types'

describe.each(['light', 'dark'] as const)('%s access management', (mode) => {
  const theme = createTheme({ palette: palette[mode] } as ThemeOptions)
  theme.font = { normal: 'sans-serif', bold: 'sans-serif' }
  theme.components = inputOverrides(theme)

  function renderAccess(props: Partial<React.ComponentProps<typeof AccessManagement>> = {}) {
    const onChange = jest.fn()
    const initialValue = props.value ?? 'user'
    function ControlledAccess() {
      const [value, setValue] = useState<AccessLevel>(initialValue)
      return (
        <AccessManagement
          {...props}
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue)
            onChange(nextValue)
          }}
        />
      )
    }
    render(
      <ThemeProvider theme={theme}>
        <ControlledAccess />
      </ThemeProvider>,
    )
    return { onChange, user: userEvent.setup() }
  }

  it('renders one named native radio group with permissions and themed cards', () => {
    renderAccess()
    const group = screen.getByRole('radiogroup', { name: 'Access Management' })
    expect(within(group).getAllByRole('radio')).toHaveLength(3)
    expect(within(group).queryByRole('button')).not.toBeInTheDocument()
    const selected = screen.getByRole('radio', { name: 'User' })
    expect(selected.tagName).toBe('INPUT')
    expect(selected).toBeChecked()
    expect(selected).toHaveAccessibleDescription('Participate in teams Create Kubernetes resources View team resources')
    expect(selected.closest('label')).toHaveStyle({
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.cm.linkActiveLight,
      borderRadius: '8px',
    })
    expect(screen.getByRole('radio', { name: 'Team admin' }).closest('label')).toHaveStyle({
      borderColor: theme.palette.divider,
    })
    expect(group).toHaveStyle({ maxWidth: '840px' })
    expect(screen.getByText('Manage users and teams')).toBeVisible()
  })

  it('selects via the card label and radio with a single callback per change', async () => {
    const { user, onChange } = renderAccess()
    await user.click(screen.getByText('Manage teams'))
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'User' })).not.toBeChecked()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith('teamAdmin')
    await user.click(screen.getByRole('radio', { name: 'Platform admin' }))
    expect(screen.getByRole('radio', { name: 'Platform admin' })).toBeChecked()
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenLastCalledWith('platformAdmin')
    await user.click(screen.getByText('Manage entire platform'))
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('supports tab entry and all arrow keys including wraparound', async () => {
    const { user, onChange } = renderAccess()
    await user.tab()
    expect(screen.getByRole('radio', { name: 'User' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Team admin' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeChecked()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Platform admin' })).toBeChecked()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'User' })).toBeChecked()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Platform admin' })).toBeChecked()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeChecked()
    expect(onChange.mock.calls).toEqual([['teamAdmin'], ['platformAdmin'], ['user'], ['platformAdmin'], ['teamAdmin']])
  })

  it('skips disabled options during keyboard and mouse selection', async () => {
    const { user, onChange } = renderAccess({ disabledOptions: ['teamAdmin'] })
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeDisabled()
    await user.click(screen.getByText('Manage teams'))
    expect(onChange).not.toHaveBeenCalled()
    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: 'Platform admin' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Platform admin' })).toBeChecked()
    expect(onChange).toHaveBeenCalledWith('platformAdmin')
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('radio', { name: 'User' })).toBeChecked()
  })

  it('preserves a selected disabled role', async () => {
    const { user, onChange } = renderAccess({ value: 'platformAdmin', disabledOptions: ['platformAdmin'] })
    const selected = screen.getByRole('radio', { name: 'Platform admin' })
    expect(selected).toBeChecked()
    expect(selected).toBeDisabled()
    await user.click(screen.getByText('Manage entire platform'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables every role without changing the selected value', async () => {
    const { user, onChange } = renderAccess({ disabled: true, value: 'teamAdmin' })
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled())
    await user.click(screen.getByText('Participate in teams'))
    await user.click(screen.getByText('Manage entire platform'))
    await user.tab()
    await user.keyboard('{ArrowRight} ')
    expect(screen.getByRole('radio', { name: 'Team admin' })).toBeChecked()
    expect(onChange).not.toHaveBeenCalled()
  })
})
