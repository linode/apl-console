import React, { useContext } from 'react'
import { Cluster, Session, User } from '@redkubes/otomi-api-client-axios'
import { ApiError } from './utils/error'

interface Versions {
  core: string
  api?: string
}

export interface SessionContext extends Session {
  cluster: Cluster | undefined
  clusters: Cluster[] | undefined
  dns: any
  globalError?: ApiError
  isAdmin: boolean | undefined
  mode: string | undefined
  oboTeamId?: string
  setGlobalError?: CallableFunction
  setOboTeamId?: CallableFunction
  setSession: CallableFunction | undefined
  setThemeType?: CallableFunction
  collapseSettings: boolean
  setCollapseSettings: CallableFunction
  themeType: string
  user: User | any
  versions: Versions | undefined
}

const context = React.createContext<SessionContext>({
  cluster: undefined,
  clusters: undefined,
  core: undefined,
  dns: undefined,
  globalError: undefined,
  isAdmin: undefined,
  mode: undefined,
  namespaces: undefined,
  oboTeamId: undefined,
  setGlobalError: undefined,
  setOboTeamId: undefined,
  setSession: undefined,
  setThemeType: undefined,
  collapseSettings: true,
  setCollapseSettings: undefined,
  themeType: undefined,
  user: { teams: undefined, name: undefined, email: undefined, isAdmin: undefined, roles: undefined, authz: undefined },
  versions: undefined,
})

export const useSession = (): SessionContext => {
  return useContext(context)
}

export default context
