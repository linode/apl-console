import React, { useContext } from 'react'
import { Cluster, Session } from '@redkubes/otomi-api-client-axios'
import { ApiError } from './utils/error'

interface Versions {
  core: string
  api?: string
}

export interface SessionContext extends Session {
  mode: string
  isAdmin: boolean
  cluster: Cluster
  clusters: Cluster[]
  dns: any
  setSession: CallableFunction
  globalError?: ApiError
  setGlobalError?: CallableFunction
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  setThemeType?: CallableFunction
  collapseSettings: boolean
  setCollapseSettings: CallableFunction
  themeType: string
  versions: Versions
}

const context = React.createContext<SessionContext>({
  mode: 'ee',
  cluster: undefined,
  clusters: undefined,
  core: undefined,
  dns: undefined,
  isAdmin: undefined,
  namespaces: undefined,
  setSession: undefined,
  globalError: undefined,
  setGlobalError: undefined,
  oboTeamId: undefined,
  setOboTeamId: undefined,
  setThemeType: undefined,
  collapseSettings: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCollapseSettings: undefined,
  themeType: undefined,
  user: { teams: undefined, name: undefined, email: undefined, isAdmin: undefined, roles: undefined, authz: undefined },
  teams: undefined,
  versions: undefined,
})

export const useSession = (): SessionContext => {
  return useContext(context)
}

export default context
