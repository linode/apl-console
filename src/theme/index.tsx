import { ReactNode, useMemo } from 'react'
// @mui
import { CssBaseline } from '@mui/material'
import { ThemeProvider as MUIThemeProvider, ThemeOptions, createTheme } from '@mui/material/styles'
//
import useSettings from 'hooks/useSettings'
import palette from './palette'
import breakpoints from './breakpoints'
import font from './font'
import componentsOverride from './overrides'
import shadows, { customShadows } from './shadows'

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode
}

export default function AppThemeProvider({ children }: Props) {
  const { themeMode } = useSettings()

  const isLight = themeMode === 'light'

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: isLight ? palette.light : palette.dark,
      breakpoints,
      font,
      shape: { borderRadius: 8 },
      direction: 'ltr',
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight ? customShadows.light : customShadows.dark,
    }),
    [isLight],
  )

  const theme = createTheme(themeOptions)

  theme.components = componentsOverride(theme)

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
