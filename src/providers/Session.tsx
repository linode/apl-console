import { setSpec } from 'common/api-spec'
import ErrorComponent from 'components/Error'
import Loader from 'components/Loader'
import { useLocalStorage } from 'hooks/useLocalStorage'
import React, { useContext, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'redux/hooks'
import {
  GetSessionApiResponse,
  GetSettingsApiResponse,
  useApiDocsQuery,
  useGetAppsQuery,
  useGetSessionQuery,
  useGetSettingsQuery,
} from 'redux/otomiApi'
import { setDirty } from 'redux/reducers'
import { ReducerState } from 'redux/store'
import { ApiErrorGatewayTimeout, ApiErrorUnauthorized } from 'utils/error'

export interface SessionContext extends GetSessionApiResponse {
  appsEnabled?: Record<string, any>
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  refetchAppsEnabled?: () => void
  refetchSettings?: () => void
  settings?: GetSettingsApiResponse
}

const Context = React.createContext<SessionContext>({
  appsEnabled: undefined,
  ca: undefined,
  core: undefined,
  oboTeamId: undefined,
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
  const dispatch = useAppDispatch()
  const { data: session, isLoading: isLoadingSession, error: errorSession, isSuccess: okSession } = useGetSessionQuery()
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
  const appsEnabled = (apps || []).reduce((memo, a) => {
    memo[a.id] = !!a.enabled
    return memo
  }, {})
  const ctx = useMemo(
    () => ({
      ...(session || {}),
      appsEnabled,
      oboTeamId,
      refetchAppsEnabled,
      refetchSettings,
      setOboTeamId,
      settings,
    }),
    [appsEnabled, oboTeamId, session, settings],
  )
  const oldDirty = useSelector(({ global }: ReducerState) => global.isDirty)
  useEffect(() => {
    // when the UI dirty flag changes on the server, and it has changed from local state, will we dispatch
    if (session && oldDirty !== session.isDirty) dispatch(setDirty(session.isDirty))
  }, [session])
  // END HOOKS
  const error = errorApps || errorSession || errorApiDocs || errorSettings
  if (error) return <ErrorComponent error={new ApiErrorGatewayTimeout()} />
  // if (error.code === 504) err = <ErrorComponent error={new ApiErrorGatewayTimeout()} />
  // else err = <ErrorComponent error={error} />
  if (isLoadingApiDocs || isLoadingApps || isLoadingSession || isLoadingSettings) return <Loader />
  if (apiDocs) setSpec(apiDocs)
  // set obo to first team if not set
  const { user } = session
  if (!user.isAdmin && !oboTeamId) {
    if (user.teams.length) {
      setOboTeamId(user.teams[0])
      return <Loader />
    }
    return <ErrorComponent error={new ApiErrorUnauthorized()} />
  }
  return <Context.Provider value={ctx}>{children}</Context.Provider>
}
