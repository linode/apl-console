import React, { useContext } from 'react'

let session

export interface SessionContext {
  initialising?: boolean
  isAdmin?: boolean
  user?: object
  teamId?: string
  clusters?: object
  changeSession?: object
  setThemeName?: CallableFunction
  setThemeType?: CallableFunction
}

export const SessionContext = React.createContext<SessionContext>({
  initialising: true,
  isAdmin: undefined,
  user: undefined,
  teamId: undefined,
  clusters: undefined,
  changeSession: undefined,
  setThemeName: undefined,
  setThemeType: undefined,
})

export const useSession = (): any => {
  session = useContext(SessionContext)
  return session
}
