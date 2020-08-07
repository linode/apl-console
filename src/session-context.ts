import React, { useContext } from 'react'
import { Session } from '@redkubes/otomi-api-client-axios'

export interface SessionContext extends Session {
  isAdmin?: boolean
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  setThemeType?: CallableFunction
  themeType: string
  setTeams: CallableFunction
}

const context = React.createContext<SessionContext>({
  clusters: undefined,
  core: undefined,
  currentClusterId: undefined,
  isAdmin: undefined,
  namespaces: undefined,
  oboTeamId: undefined,
  setOboTeamId: undefined,
  setThemeType: undefined,
  themeType: undefined,
  user: { teams: undefined, email: undefined, isAdmin: undefined, roles: undefined },
  teams: undefined,
  setTeams: undefined,
})

export const useSession = (): SessionContext => {
  return useContext(context)
}

export default context
