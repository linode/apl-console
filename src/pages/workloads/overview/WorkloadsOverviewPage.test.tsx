import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import React from 'react'
import palette from 'theme/palette'
import { getStatus } from './WorkloadsOverviewPage'

jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: React.SVGProps<SVGSVGElement> & { icon: string }) => (
    <svg data-testid='status-icon' data-icon={icon} {...props} />
  ),
}))

jest.mock('components/Link', () => () => null)
jest.mock('components/ListTable', () => () => null)
jest.mock('layouts/Paper', () => () => null)
jest.mock('providers/Session', () => ({ useSession: jest.fn() }))
jest.mock('providers/Socket', () => ({ useSocket: jest.fn() }))
jest.mock('redux/hooks', () => ({ useAppSelector: jest.fn() }))
jest.mock('redux/otomiApi', () => ({
  useGetAllAplWorkloadsQuery: jest.fn(),
  useGetTeamAplWorkloadsQuery: jest.fn(),
}))

describe.each(['light', 'dark'] as const)('getStatus in %s mode', (mode) => {
  const theme = createTheme({
    palette: {
      ...palette[mode],
      mode,
      error: { ...palette[mode].error, main: mode === 'light' ? 'rgb(161, 32, 48)' : 'rgb(241, 112, 128)' },
      warning: { ...palette[mode].warning, main: mode === 'light' ? 'rgb(145, 98, 16)' : 'rgb(225, 178, 96)' },
      success: { ...palette[mode].success, main: mode === 'light' ? 'rgb(24, 113, 65)' : 'rgb(104, 193, 145)' },
    },
  })

  it.each([
    ['Unknown', 'error', 'eva:alert-circle-fill'],
    ['Pending', 'warning', 'eva:alert-triangle-fill'],
    ['Succeeded', 'success', 'eva:checkmark-circle-2-fill'],
  ] as const)('renders %s with the %s palette color and original icon', (status, color, iconName) => {
    render(<ThemeProvider theme={theme}>{getStatus(status)}</ThemeProvider>)

    const icon = screen.getByTestId('status-icon')

    expect(icon).toHaveAttribute('data-icon', iconName)
    expect(icon).toHaveStyle({
      color: theme.palette[color].main,
      width: '22px',
      height: '22px',
    })
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it.each([undefined, 'NotFound', 'Unrecognized'])('renders a 22px spinner for %s', (status) => {
    // Socket data can contain statuses outside the declared TypeScript union.
    render(<ThemeProvider theme={theme}>{getStatus(status as Parameters<typeof getStatus>[0])}</ThemeProvider>)

    expect(screen.getByRole('progressbar')).toHaveClass('MuiCircularProgress-indeterminate')
    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '22px', height: '22px' })
    expect(screen.queryByTestId('status-icon')).not.toBeInTheDocument()
  })
})
