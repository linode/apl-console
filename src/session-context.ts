import React, { useContext } from 'react'
import { Session } from '@redkubes/otomi-api-client-axios'

export interface SessionContext extends Session {
  mode: string
  isAdmin?: boolean
  setSession: CallableFunction
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  setThemeType?: CallableFunction
  themeType: string
}

const context = React.createContext<SessionContext>({
  mode: 'ee',
  clusters: undefined,
  core: undefined,
  currentClusterId: undefined,
  isAdmin: undefined,
  namespaces: undefined,
  setSession: undefined,
  oboTeamId: undefined,
  setOboTeamId: undefined,
  setThemeType: undefined,
  themeType: undefined,
  user: { teams: undefined, email: undefined, isAdmin: undefined, roles: undefined },
  teams: undefined,
})

export const useSession = (): SessionContext => {
  return useContext(context)
}

export default context
