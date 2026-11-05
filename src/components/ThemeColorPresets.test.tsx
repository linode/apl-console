import { Box, FormControlLabel, LinearProgress, Radio, RadioGroup } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { cookiesKey, defaultSettings } from 'config'
import { SettingsProvider } from 'contexts/SettingsContext'
import useSettings from 'hooks/useSettings'
import AppThemeProvider from 'theme'
import palette from 'theme/palette'
import getColorPresets from 'utils/getColorPresets'
import { ThemeColorPresets as ColorPreset, ThemeMode } from './SettingsType'
import ThemeColorPresets from './ThemeColorPresets'

function SettingsControls() {
  const theme = useTheme()
  const { themeMode, themeColorPresets, colorOption, onChangeMode, onChangeColor } = useSettings()

  return (
    <Box
      component='section'
      aria-label='Theme preview'
      sx={{
        color: 'primary.main',
        backgroundColor: 'background.default',
        boxShadow: theme.customShadows.primary,
      }}
    >
      <RadioGroup aria-label='Theme mode' name='themeMode' value={themeMode} onChange={onChangeMode}>
        {(['light', 'dark', 'system'] as const).map((mode) => (
          <FormControlLabel key={mode} value={mode} control={<Radio />} label={`Mode ${mode}`} />
        ))}
      </RadioGroup>
      <RadioGroup aria-label='Color preset' name='themeColorPresets' value={themeColorPresets} onChange={onChangeColor}>
        {colorOption.map(({ name }) => (
          <FormControlLabel key={name} value={name} control={<Radio />} label={`Preset ${name}`} />
        ))}
      </RadioGroup>
      <LinearProgress aria-label='Themed progress' color='primary' variant='determinate' value={50} />
      <output data-testid='resolved-theme'>
        {JSON.stringify({
          mode: theme.palette.mode,
          primary: theme.palette.primary,
          primaryShadow: theme.customShadows.primary,
        })}
      </output>
    </Box>
  )
}

function renderSettings(themeMode: ThemeMode) {
  // Keep the production provider chain: MUI 6 must receive valid createTheme options at every level.
  return render(
    <SettingsProvider defaultSettings={{ ...defaultSettings, themeMode }}>
      <AppThemeProvider>
        <ThemeColorPresets>
          <SettingsControls />
        </ThemeColorPresets>
      </AppThemeProvider>
    </SettingsProvider>,
  )
}

function expectTheme(mode: 'light' | 'dark', preset: ColorPreset) {
  const { main, light, lighter, dark, darker, contrastText } = getColorPresets(preset)
  const primaryShadow = `0 8px 16px 0 ${alpha(main, 0.24)}`

  expect(JSON.parse(screen.getByTestId('resolved-theme').textContent)).toEqual({
    mode,
    primary: expect.objectContaining({ main, light, lighter, dark, darker, contrastText }),
    primaryShadow,
  })
  expect(screen.getByRole('region', { name: 'Theme preview' })).toBeVisible()
  expect(screen.getByRole('region', { name: 'Theme preview' })).toHaveStyle({
    color: main,
    backgroundColor: palette[mode].background.default,
    boxShadow: primaryShadow,
  })

  const selectedPreset = screen.getByRole('radio', { name: `Preset ${preset}` })
  expect(selectedPreset).toBeChecked()
  expect(selectedPreset.closest('.MuiRadio-root')).toHaveStyle({ color: main })
  // Unlike MUI's default track color, this override captures the preset and mode when built.
  expect(screen.getByRole('progressbar', { name: 'Themed progress' })).toHaveStyle({
    backgroundColor: mode === 'light' ? lighter : darker,
  })
}

describe('ThemeColorPresets provider integration', () => {
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia')
  const mediaQuery = Object.assign(new EventTarget(), {
    matches: false,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })

  beforeEach(() => {
    mediaQuery.matches = false
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn(() => mediaQuery),
    })
    Object.values(cookiesKey).forEach((key) => Cookies.remove(key))
  })

  afterEach(() => {
    cleanup()
    Object.values(cookiesKey).forEach((key) => Cookies.remove(key))
    if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia)
    else Reflect.deleteProperty(window, 'matchMedia')
  })

  it.each([
    { initialMode: 'light', systemDark: true, resolvedMode: 'light' },
    { initialMode: 'dark', systemDark: false, resolvedMode: 'dark' },
    { initialMode: 'system', systemDark: false, resolvedMode: 'light' },
    { initialMode: 'system', systemDark: true, resolvedMode: 'dark' },
  ] as const)(
    'renders $initialMode (system dark: $systemDark) and updates through real settings controls',
    async ({ initialMode, systemDark, resolvedMode }) => {
      const user = userEvent.setup()
      mediaQuery.matches = systemDark
      renderSettings(initialMode)
      const preview = screen.getByRole('region', { name: 'Theme preview' })

      expect(screen.getByRole('radio', { name: `Mode ${initialMode}` })).toBeChecked()
      expectTheme(resolvedMode, defaultSettings.themeColorPresets)

      await user.click(screen.getByRole('radio', { name: 'Preset purple' }))
      expectTheme(resolvedMode, 'purple')

      const nextMode = resolvedMode === 'light' ? 'dark' : 'light'
      await user.click(screen.getByRole('radio', { name: `Mode ${nextMode}` }))
      expect(screen.getByRole('radio', { name: `Mode ${nextMode}` })).toBeChecked()
      expectTheme(nextMode, 'purple')

      await user.click(screen.getByRole('radio', { name: 'Preset orange' }))
      expectTheme(nextMode, 'orange')

      await user.click(screen.getByRole('radio', { name: 'Mode system' }))
      expect(screen.getByRole('radio', { name: 'Mode system' })).toBeChecked()
      expectTheme(systemDark ? 'dark' : 'light', 'orange')
      expect(screen.getByRole('region', { name: 'Theme preview' })).toBe(preview)
    },
  )

  it('updates system mode on media changes without losing the selected preset', async () => {
    const user = userEvent.setup()
    renderSettings('system')
    expectTheme('light', defaultSettings.themeColorPresets)

    await user.click(screen.getByRole('radio', { name: 'Preset purple' }))
    expectTheme('light', 'purple')

    act(() => {
      mediaQuery.matches = true
      mediaQuery.dispatchEvent(Object.assign(new Event('change'), { matches: true }))
    })
    expectTheme('dark', 'purple')
    expect(screen.getByRole('radio', { name: 'Mode system' })).toBeChecked()

    act(() => {
      mediaQuery.matches = false
      mediaQuery.dispatchEvent(Object.assign(new Event('change'), { matches: false }))
    })
    expectTheme('light', 'purple')
  })
})
