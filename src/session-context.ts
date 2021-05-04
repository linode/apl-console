import React, { useContext } from 'react'
import { Session } from '@redkubes/otomi-api-client-axios'

interface Versions {
  core: string
  api?: string
}

export interface SessionContext extends Session {
  mode: string
  isAdmin?: boolean
  setSession: CallableFunction
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  setThemeType?: CallableFunction
  themeType: string
  versions: Versions
}

const context = React.createContext<SessionContext>({
  mode: 'ee',
  cluster: undefined,
  core: undefined,
  dns: undefined,
  isAdmin: undefined,
  namespaces: undefined,
  setSession: undefined,
  oboTeamId: undefined,
  setOboTeamId: undefined,
  setThemeType: undefined,
  themeType: undefined,
  user: { teams: undefined, email: undefined, isAdmin: undefined, name: undefined, roles: undefined },
  teams: undefined,
  versions: undefined,
})

export const useSession = (): SessionContext => {
  return useContext(context)
}

export default context
