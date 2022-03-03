import { Cluster, Dns, Session, Team, User } from '@redkubes/otomi-api-client-axios'
import React, { useContext } from 'react'
import { ApiError } from 'utils/error'

interface Versions {
  core: string
  api?: string
}

export interface SessionContext extends Session {
  ca: string | undefined
  cluster: Cluster | undefined
  clusters: Cluster[] | undefined
  core: any
  dirty: boolean
  dns: Dns | undefined
  globalError?: ApiError
  isAdmin: boolean | undefined
  oboTeamId?: string
  setDirty?: CallableFunction
  setGlobalError?: CallableFunction
  setOboTeamId?: CallableFunction
  setSession: CallableFunction | undefined
  setThemeMode?: CallableFunction
  teams: Array<Team>
  themeType: string
  user: User | any
  versions: Versions | undefined
  isMultitenant: boolean
}

const context = React.createContext<SessionContext>({
  ca: '',
  cluster: new Cluster(),
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
  setSession: undefined,
  setThemeMode: undefined,
  teams: undefined,
  themeType: undefined,
  user: { teams: undefined, name: undefined, email: undefined, isAdmin: undefined, roles: undefined, authz: undefined },
  versions: undefined,
  isMultitenant: undefined,
})

export const useSession = (): SessionContext => useContext(context)

export default context
