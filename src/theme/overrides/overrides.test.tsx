import { render, screen } from '@testing-library/react'
import { Autocomplete, Button, InputAdornment, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import palette from '../palette'
import font from '../font'
import shadows, { customShadows } from '../shadows'
import componentsOverride from './index'
import buttonOverrides from './Button'
import inputOverrides from './Input'
import tableOverrides from './Table'
import typographyOverrides from './Typography'

describe.each(['light', 'dark'] as const)('%s Cloud Manager overrides', (mode) => {
  const theme = createTheme({
    palette: palette[mode],
    typography: {
      fontFamily: font.normal,
      body1: { fontSize: '0.875rem', lineHeight: '1.25rem' },
      body2: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    },
    shadows: shadows[mode],
    customShadows: customShadows[mode],
  } as ThemeOptions)
  theme.components = componentsOverride(theme)

  it('keeps outlined borders and flat button focus styling separate', () => {
    const { root, contained, outlinedPrimary } = buttonOverrides(theme).MuiButton.styleOverrides
    expect(root).not.toHaveProperty('border')
    expect(root).toMatchObject({
      padding: '8px 12px',
      borderRadius: 1,
      fontWeight: 600,
      boxShadow: 'none',
    })
    expect(root['&.Mui-focusVisible, &:focus-visible'].outline).toContain(theme.palette.cm.linkActiveLight)
    expect(contained.border).toBe('1px solid transparent')
    expect(outlinedPrimary['&:hover:not(.Mui-disabled):not([aria-disabled="true"])'].borderColor).toBe(
      theme.palette.cm.buttonPrimaryHover,
    )
  })

  it('uses theme typography without overriding semantic text colors', () => {
    const { body1, h1, caption } = typographyOverrides(theme).MuiTypography.styleOverrides
    expect(body1).toEqual(theme.typography.body1)
    expect(h1).toEqual(theme.typography.h1)
    expect(caption).toEqual(theme.typography.caption)
    expect(body1).not.toHaveProperty('color')
    render(
      <ThemeProvider theme={theme}>
        <Typography color='error'>Error text</Typography>
        <Button disabled variant='contained'>
          Disabled action
        </Button>
      </ThemeProvider>,
    )
    expect(screen.getByText('Error text')).toHaveStyle({ color: theme.palette.error.main })
    expect(screen.getByRole('button', { name: 'Disabled action' })).toBeDisabled()
  })

  it('retains outlined error/disabled borders and makes focused errors visible', () => {
    const overrides = inputOverrides(theme)
    const { root, notchedOutline } = overrides.MuiOutlinedInput.styleOverrides
    expect(root).not.toHaveProperty('& .MuiOutlinedInput-notchedOutline')
    expect(notchedOutline.borderColor).toBe(theme.palette.cm.textBoxBorder)
    expect(root['&.Mui-disabled']['& .MuiOutlinedInput-notchedOutline'].borderColor).toBe(
      theme.palette.cm.disabledBorder,
    )
    expect(overrides.MuiInputBase.styleOverrides.root['&.Mui-focused.Mui-error:not(.Mui-disabled)'].outline).toContain(
      theme.palette.error.main,
    )
  })

  it.each(['standard', 'outlined', 'filled'] as const)('preserves %s input states and multiline layout', (variant) => {
    render(
      <ThemeProvider theme={theme}>
        <TextField
          label='Endpoint'
          variant={variant}
          error
          focused
          InputProps={{ startAdornment: <InputAdornment position='start'>https://</InputAdornment> }}
        />
        <TextField label='Notes' variant={variant} multiline rows={3} defaultValue={'First\nSecond'} />
        <TextField label='Unavailable' variant={variant} disabled />
      </ThemeProvider>,
    )
    expect(screen.getByRole('textbox', { name: 'Endpoint' })).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('textbox', { name: 'Endpoint' }).parentElement).toHaveClass('Mui-focused', 'Mui-error')
    expect(screen.getByText('https://')).toBeVisible()
    expect(screen.getByRole('textbox', { name: 'Notes' }).tagName).toBe('TEXTAREA')
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('First\nSecond')
    expect(screen.getByRole('textbox', { name: 'Unavailable' })).toBeDisabled()
  })

  it('keeps table geometry and zebra colors theme-aware', () => {
    const overrides = tableOverrides(theme)
    expect(overrides.MuiTableCell.styleOverrides.root).toMatchObject({
      height: 40,
      padding: '0px 12px',
      borderRadius: 0,
      borderBottom: `1px solid ${theme.palette.divider}`,
    })
    expect(overrides.MuiTableRow.styleOverrides.root['&:nth-of-type(even)'].backgroundColor).toBe(
      theme.palette.cm.rowAlter,
    )
  })

  it.each(['standard', 'outlined'] as const)('keeps %s single-line inputs compact', (variant) => {
    render(
      <ThemeProvider theme={theme}>
        <TextField label='Compact input' variant={variant} />
        <Autocomplete
          options={['First', 'Second']}
          renderInput={(params) =>
            variant === 'standard' ? (
              <TextField
                {...params}
                InputLabelProps={{ ...params.InputLabelProps, children: undefined }}
                label='Compact autocomplete'
                variant='standard'
              />
            ) : (
              <TextField
                {...params}
                InputLabelProps={{ ...params.InputLabelProps, children: undefined }}
                label='Compact autocomplete'
                variant='outlined'
              />
            )
          }
        />
        <TextField label='Compact select' select variant={variant} value='first'>
          <MenuItem value='first'>First</MenuItem>
        </TextField>
      </ThemeProvider>,
    )
    const input = screen.getByRole('textbox', { name: 'Compact input' })
    const autocomplete = screen.getByRole('combobox', { name: 'Compact autocomplete' })
    expect(input).toHaveStyle({ height: '1.25rem', paddingTop: '7px', paddingBottom: '7px' })
    expect(input.parentElement).toHaveStyle({ minHeight: '34px' })
    expect(autocomplete).toHaveStyle({ height: '1.25rem', paddingTop: '7px', paddingBottom: '7px' })
    expect(autocomplete.parentElement).toHaveStyle({ minHeight: '34px', paddingTop: '0px', paddingBottom: '0px' })
    expect(screen.getByRole('button', { name: 'Compact select First' })).toHaveStyle({ minHeight: '1.25rem' })
  })

  it('preserves selected and disabled tab semantics', () => {
    render(
      <ThemeProvider theme={theme}>
        <Tabs value={0}>
          <Tab label='Active' />
          <Tab label='Unavailable' disabled />
        </Tabs>
      </ThemeProvider>,
    )
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Unavailable' })).toBeDisabled()
  })
})
