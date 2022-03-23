import { Cluster, Session, Settings, Team, User } from '@redkubes/otomi-api-client-axios'
import React, { useContext } from 'react'
import { ApiError } from 'utils/error'

interface Versions {
  core: string
  api?: string
}

export interface SessionContext extends Session {
  appsEnabled?: Record<string, any>
  ca?: string
  cluster?: Cluster
  clusters?: Cluster[]
  core: any
  dirty: boolean
  globalError?: ApiError
  isAdmin: boolean
  oboTeamId?: string
  setDirty?: CallableFunction
  setGlobalError?: CallableFunction
  setOboTeamId?: CallableFunction
  setRefreshApps?: CallableFunction
  setRefreshSettings?: CallableFunction
  setSession?: CallableFunction
  setThemeMode?: CallableFunction
  settings?: Settings
  teams?: Array<Team>
  themeType?: string
  user?: User
  versions?: Versions
}

const context = React.createContext<SessionContext>({
  appsEnabled: undefined,
  ca: '',
  cluster: undefined,
  clusters: undefined,
  core: {},
  dirty: undefined,
  dns: undefined,
  globalError: undefined,
  isAdmin: undefined,
  oboTeamId: undefined,
  setDirty: undefined,
  setGlobalError: undefined,
  setOboTeamId: undefined,
  setRefreshApps: undefined,
  setRefreshSettings: undefined,
  setSession: undefined,
  setThemeMode: undefined,
  settings: undefined,
  teams: undefined,
  themeType: undefined,
  user: { teams: undefined, name: undefined, email: undefined, isAdmin: undefined, roles: undefined, authz: undefined },
  versions: undefined,
})

export const useSession = (): SessionContext => useContext(context)

export default context
