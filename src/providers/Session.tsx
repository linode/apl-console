import { setSpec } from 'common/api-spec'
import ErrorComponent from 'components/Error'
import Loader from 'components/Loader'
import { useLocalStorage } from 'hooks/useLocalStorage'
import React, { useContext, useMemo, useState } from 'react'
import {
  GetSessionApiResponse,
  GetSettingsApiResponse,
  useApiDocsQuery,
  useGetAppsQuery,
  useGetSessionQuery,
  useGetSettingsQuery,
} from 'store/otomi'
import { ApiErrorGatewayTimeout, ApiErrorUnauthorized } from 'utils/error'

export interface SessionContext extends GetSessionApiResponse {
  appsEnabled?: Record<string, any>
  oboTeamId?: string
  setDirty?: CallableFunction
  setOboTeamId?: CallableFunction
  refetchAppsEnabled?: () => void
  refetchSettings?: () => void
  settings?: GetSettingsApiResponse
}

const Context = React.createContext<SessionContext>({
  appsEnabled: undefined,
  ca: undefined,
  core: undefined,
  isDirty: undefined,
  oboTeamId: undefined,
  setDirty: undefined,
  setOboTeamId: undefined,
  settings: undefined,
  user: { teams: undefined, name: undefined, email: undefined, isAdmin: undefined, roles: undefined, authz: undefined },
  versions: undefined,
})

export const useSession = (): SessionContext => useContext(Context)

interface Props {
  children: any
}

export default function SessionProvider({ children }: Props): React.ReactElement {
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  const [isDirty, setDirty] = useState()
  const { data: session, isLoading: isLoadingSession, error: errorSession } = useGetSessionQuery()
  const {
    data: settings,
    isLoading: isLoadingSettings,
    error: errorSettings,
    refetch: refetchSettings,
  } = useGetSettingsQuery({ ids: ['cluster', 'dns', 'otomi'] })
  const {
    data: apps,
    isLoading: isLoadingApps,
    error: errorApps,
    refetch: refetchAppsEnabled,
  } = useGetAppsQuery({ teamId: 'admin', picks: ['id', 'enabled'] })
  const { data: apiDocs, isLoading: isLoadingApiDocs, error: errorApiDocs } = useApiDocsQuery()
  // END HOOKS
  const appsEnabled = (apps || []).reduce((memo, a) => {
    memo[a.id] = !!a.enabled
    return memo
  }, {})
  const ctx = useMemo(
    () => ({
      ...(session || {}),
      appsEnabled,
      isDirty: isDirty === undefined ? session?.isDirty : isDirty,
      oboTeamId,
      refetchAppsEnabled,
      refetchSettings,
      setDirty,
      setOboTeamId,
      settings,
    }),
    [appsEnabled, isDirty, oboTeamId, session, settings],
  )
  if (isLoadingApiDocs || isLoadingApps || isLoadingSession || isLoadingSettings) return <Loader />
  const error = errorApps || errorSession || errorApiDocs || errorSettings
  let err = error && <ErrorComponent error={new ApiErrorGatewayTimeout()} />
  // if (error.code === 504) err = <ErrorComponent error={new ApiErrorGatewayTimeout()} />
  // else err = <ErrorComponent error={error} />
  if (apiDocs) setSpec(apiDocs)
  if (!err) {
    const { user } = session
    if (!user.isAdmin && !oboTeamId) {
      if (user.teams.length) {
        setOboTeamId(user.teams[0])
        return <Loader />
      }
      err = <ErrorComponent error={new ApiErrorUnauthorized()} />
    }
  }
  return err || (session && <Context.Provider value={ctx}>{children}</Context.Provider>)
}
