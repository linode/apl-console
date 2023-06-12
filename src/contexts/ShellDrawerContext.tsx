/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactNode, createContext, useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { HEADER } from 'config'

// ----------------------------------------------------------------------

export type ShellDrawerContextProps = {
  isShell?: boolean
  isMinimized?: boolean
  iFrameUrl?: string
  shellHeight?: number
  onOpenShell: VoidFunction
  onCloseShell: VoidFunction
  onSetIFrameUrl: (url: string) => void
  onSetShellHeight?: (height: number) => void
  onToggleShell?: VoidFunction
}

const initialState: ShellDrawerContextProps = {
  isShell: false,
  isMinimized: false,
  iFrameUrl: '',
  shellHeight: 20,
  onOpenShell: () => {},
  onCloseShell: () => {},
  onSetIFrameUrl: () => {},
  onSetShellHeight: () => {},
  onToggleShell: () => {},
}

const ShellDrawerContext = createContext(initialState)

type ShellDrawerProviderProps = {
  children: ReactNode
}

function ShellDrawerProvider({ children }: ShellDrawerProviderProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const minShellHeight = 20
  const maxShellHeight = window.innerHeight - HEADER.DASHBOARD_DESKTOP_HEIGHT
  const defaultShellHeight = 250
  const [shell, setShell] = useState({
    isShell: false,
    isMinimized: true,
    iFrameUrl: '',
    shellHeight: minShellHeight,
  })
  console.log('shell', shell)

  useEffect(() => {
    if (isMobile) {
      setShell({
        isShell: false,
        isMinimized: true,
        iFrameUrl: '',
        shellHeight: minShellHeight,
      })
    }
  }, [isMobile])

  const handleOpenShell = () => {
    setShell({ ...shell, isShell: true })
  }
  const handleCloseShell = () => {
    setShell({ ...shell, isShell: false })
  }

  const handleSetIFrameUrl = (url: string) => {
    setShell({ ...shell, iFrameUrl: url, isMinimized: false, shellHeight: defaultShellHeight })
  }

  const handleSetShellHeight = (height: number) => {
    if (height > minShellHeight && height < maxShellHeight)
      setShell({ ...shell, isMinimized: false, shellHeight: height })
  }

  const handleToggleShell = () => {
    if (shell.isMinimized) setShell({ ...shell, isMinimized: !shell.isMinimized, shellHeight: defaultShellHeight })
    else setShell({ ...shell, isMinimized: !shell.isMinimized, shellHeight: minShellHeight })
  }

  return (
    <ShellDrawerContext.Provider
      value={{
        isShell: shell.isShell,
        isMinimized: shell.isMinimized,
        iFrameUrl: shell.iFrameUrl,
        shellHeight: shell.shellHeight,
        onOpenShell: handleOpenShell,
        onCloseShell: handleCloseShell,
        onSetIFrameUrl: handleSetIFrameUrl,
        onSetShellHeight: handleSetShellHeight,
        onToggleShell: handleToggleShell,
      }}
    >
      {children}
    </ShellDrawerContext.Provider>
  )
}

export { ShellDrawerProvider, ShellDrawerContext }
