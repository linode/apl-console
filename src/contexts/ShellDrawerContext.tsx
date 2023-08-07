/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ReactNode, createContext, useState } from 'react'
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
  shellHeight: 250,
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
  const minShellHeight = 20
  const maxShellHeight = window.innerHeight - HEADER.DASHBOARD_DESKTOP_HEIGHT
  const defaultShellHeight = 250
  const [shell, setShell] = useState({
    isShell: false,
    isMinimized: false,
    iFrameUrl: '',
    shellHeight: defaultShellHeight,
  })

  const handleOpenShell = () => {
    setShell((shell) => {
      return { ...shell, isShell: true }
    })
  }
  const handleCloseShell = () => {
    setShell((shell) => {
      return { ...shell, isShell: false }
    })
  }

  const handleSetIFrameUrl = (url: string) => {
    setShell((shell) => {
      return {
        ...shell,
        iFrameUrl: url,
        isMinimized: false,
        shellHeight: defaultShellHeight,
      }
    })
  }

  const handleSetShellHeight = (height: number) => {
    if (height > minShellHeight && height < maxShellHeight) {
      setShell((shell) => {
        return { ...shell, shellHeight: height }
      })
    }
  }

  const handleToggleShell = () => {
    if (shell.isMinimized) {
      setShell((shell) => {
        return { ...shell, isMinimized: !shell.isMinimized, shellHeight: defaultShellHeight }
      })
    } else {
      setShell((shell) => {
        return { ...shell, isMinimized: !shell.isMinimized, shellHeight: minShellHeight }
      })
    }
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
