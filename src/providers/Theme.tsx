import { ThemeProvider as TP } from '@mui/material'
import { getTheme, setThemeMode, setThemeName } from 'common/theme'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useSession } from 'providers/Session'
import React, { useContext, useMemo } from 'react'

export interface ThemeContext {
  themeMode: string
  setThemeMode: CallableFunction
}

const Context = React.createContext<ThemeContext>({
  themeMode: undefined,
  setThemeMode: undefined,
})

export const useTheme = (): ThemeContext => useContext(Context)

interface Props {
  children: any
}

export default function ThemeProvider({ children }: Props): React.ReactElement {
  const [themeMode, setThemeModeHook] = useLocalStorage('themeMode', 'light')
  const ctx = useMemo(
    () => ({
      themeMode,
      setThemeMode: setThemeModeHook,
    }),
    [themeMode],
  )
  const { user } = useSession()
  // END HOOKS
  setThemeName(user.isAdmin ? 'admin' : 'team')
  setThemeMode(themeMode)
  const theme = getTheme()
  return (
    <Context.Provider value={ctx}>
      <TP theme={theme}>{children}</TP>
    </Context.Provider>
  )
}
