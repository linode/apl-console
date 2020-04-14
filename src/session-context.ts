import React, { useContext } from 'react'

let session

export interface SessionContext {
  isAdmin?: boolean
  user?: object
  teamId?: string
  clusters?: object
  setTeamId?: object
  setThemeName?: CallableFunction
  setThemeType?: CallableFunction
}

export const SessionContext = React.createContext<SessionContext>({
  isAdmin: undefined,
  user: undefined,
  teamId: undefined,
  clusters: undefined,
  setTeamId: undefined,
  setThemeName: undefined,
  setThemeType: undefined,
})

export const useSession = (): any => {
  session = useContext(SessionContext)
  return session
}
