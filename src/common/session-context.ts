import React, { useContext } from 'react'
import { Cluster, Dns, Session, User } from '@redkubes/otomi-api-client-axios'
import { ApiError } from 'utils/error'

interface Versions {
  core: string
  api?: string
}

export interface SessionContext extends Session {
  cluster: Cluster | undefined
  clusters: Cluster[] | undefined
  collapseSettings: boolean
  core: any
  dirty: boolean
  dns: Dns | undefined
  globalError?: ApiError
  isAdmin: boolean | undefined
  oboTeamId?: string
  setCollapseSettings: CallableFunction
  setDirty?: CallableFunction
  setGlobalError?: CallableFunction
  setOboTeamId?: CallableFunction
  setSession: CallableFunction | undefined
  setThemeMode?: CallableFunction
  themeType: string
  user: User | any
  versions: Versions | undefined
}

const context = React.createContext<SessionContext>({
  ca: undefined,
  cluster: undefined,
  clusters: undefined,
  collapseSettings: true,
  core: undefined,
  dirty: undefined,
  dns: undefined,
  globalError: undefined,
  isAdmin: undefined,
  namespaces: undefined,
  oboTeamId: undefined,
  setCollapseSettings: undefined,
  setDirty: undefined,
  setGlobalError: undefined,
  setOboTeamId: undefined,
  setSession: undefined,
  setThemeMode: undefined,
  themeType: undefined,
  user: { teams: undefined, name: undefined, email: undefined, isAdmin: undefined, roles: undefined, authz: undefined },
  versions: undefined,
})

export const useSession = (): SessionContext => useContext(context)

export default context
