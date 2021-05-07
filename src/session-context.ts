import React, { useContext } from 'react'
import { Session } from '@redkubes/otomi-api-client-axios'
import { ApiError } from './utils/error'

interface Versions {
  core: string
  api?: string
}

export interface SessionContext extends Session {
  mode: string
  isAdmin?: boolean
  setSession: CallableFunction
  globalError?: ApiError
  setGlobalError?: CallableFunction
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  setThemeType?: CallableFunction
  themeType: string
  versions: Versions
}

const context = React.createContext<SessionContext>({
  mode: 'ee',
  clusters: undefined,
  core: undefined,
  currentClusterId: undefined,
  isAdmin: undefined,
  namespaces: undefined,
  setSession: undefined,
  globalError: undefined,
  setGlobalError: undefined,
  oboTeamId: undefined,
  setOboTeamId: undefined,
  setThemeType: undefined,
  themeType: undefined,
  user: { teams: undefined, name: undefined, email: undefined, isAdmin: undefined, roles: undefined },
  teams: undefined,
  versions: undefined,
})

export const useSession = (): SessionContext => {
  return useContext(context)
}

export default context
