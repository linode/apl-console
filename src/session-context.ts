import React, { useContext } from 'react'
import { Session } from '@redkubes/otomi-api-client-axios'

let session

export interface SessionContext extends Session {
  isAdmin?: boolean
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  setThemeType?: CallableFunction
  themeType: string
}

export const SessionContext = React.createContext<SessionContext>({
  clusters: undefined,
  core: undefined,
  currentClusterId: undefined,
  isAdmin: undefined,
  namespaces: undefined,
  oboTeamId: undefined,
  setOboTeamId: undefined,
  setThemeType: undefined,
  themeType: undefined,
  user: { teams: [], email: undefined, isAdmin: undefined, roles: [] },
})

export const useSession = (): SessionContext => {
  session = useContext(SessionContext)
  return session
}
