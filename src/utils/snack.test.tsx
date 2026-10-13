import { ThemeProvider, createTheme } from '@mui/material/styles'
import { act, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import palette from 'theme/palette'
import { customShadows } from 'theme/shadows'
import snack, { NotistackProvider, SnackbarUtilsConfigurator } from './snack'

jest.mock('components/Iconify', () => ({
  __esModule: true,
  default: () => <svg aria-hidden='true' />,
}))

describe.each(['light', 'dark'] as const)('notistack 3 integration in %s mode', (mode) => {
  const theme = createTheme({
    palette: palette[mode],
    customShadows: customShadows[mode],
  })

  beforeEach(() => {
    render(
      <div id='root'>
        <ThemeProvider theme={theme}>
          <NotistackProvider>
            <SnackbarUtilsConfigurator />
          </NotistackProvider>
        </ThemeProvider>
      </div>,
    )
  })

  it.each(['info', 'success', 'warning', 'error'] as const)(
    'enqueues a real %s snackbar with themed content, message and action styles',
    (variant) => {
      const message = `${variant} notification`
      act(() => {
        expect(snack[variant](message, { key: variant, persist: true })).toBe(variant)
      })

      const content = screen.getByRole('alert')
      expect(content).toHaveClass('notistack-MuiContent', `notistack-MuiContent-${variant}`)
      expect(content).toHaveStyle({
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: theme.spacing(1),
        boxShadow: theme.customShadows.z8,
      })
      expect(within(content).getByText(message)).toHaveAttribute('id', 'notistack-snackbar')
      expect(within(content).getByText(message)).toHaveStyle({
        padding: '0px',
        fontWeight: String(theme.typography.fontWeightMedium),
      })

      const action = content.lastElementChild
      expect(action).toContainElement(within(content).getByRole('button'))
      expect(action).toHaveStyle({ marginRight: '0px', color: theme.palette.action.active })
      expect(within(content).getByRole('button').querySelector('svg')).toHaveStyle({
        width: '20px',
        height: '20px',
      })
    },
  )

  it('invokes SnackbarProps.onClick so the Session-style handler can close its snackbar', async () => {
    const user = userEvent.setup()
    const key = 'session-processing'
    const onClick = jest.fn(() => snack.close(key))
    act(() => {
      snack.info('Processing... Hold on!', { key, persist: true, SnackbarProps: { onClick } })
    })

    const content = screen.getByRole('alert')
    await user.click(within(content).getByText('Processing... Hold on!'))

    expect(onClick).toHaveBeenCalledTimes(1)
    await waitForElementToBeRemoved(content, { timeout: 2000 })
    expect(screen.queryByText('Processing... Hold on!')).not.toBeInTheDocument()
  })

  it('dismisses only the selected persistent snackbar with its close action', async () => {
    const user = userEvent.setup()
    act(() => {
      snack.info('Dismiss this notification', { persist: true })
      snack.success('Keep this notification', { persist: true })
    })

    const content = screen.getByText('Dismiss this notification').closest('[role="alert"]')
    expect(content).toBeInTheDocument()
    await user.click(within(content as HTMLElement).getByRole('button'))

    await waitForElementToBeRemoved(content, { timeout: 2000 })
    expect(screen.queryByText('Dismiss this notification')).not.toBeInTheDocument()
    expect(screen.getByText('Keep this notification')).toBeVisible()
  })
})
