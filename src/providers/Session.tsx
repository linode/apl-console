import { skipToken } from '@reduxjs/toolkit/query/react'
import { setSpec } from 'common/api-spec'
import LoadingScreen from 'components/LoadingScreen'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { SnackbarKey } from 'notistack'
import Logout from 'pages/Logout'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  GetSessionApiResponse,
  GetSettingsInfoApiResponse,
  useGetAppsQuery,
  useGetSessionQuery,
  useGetSettingsInfoQuery,
  useV1ApiDocsQuery,
} from 'redux/otomiApi'
import {
  ApiErrorGatewayTimeout,
  ApiErrorServiceUnavailable,
  ApiErrorUnauthorized,
  ApiErrorUnauthorizedNoGroups,
  HttpError,
} from 'utils/error'
import snack from 'utils/snack'

export interface SessionContext extends GetSessionApiResponse {
  appsEnabled?: Record<string, any>
  editor?: string
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  refetchAppsEnabled?: () => void
  refetchSession?: () => void
  refetchSettings?: () => void
  settings?: GetSettingsInfoApiResponse
  sealedSecretsPEM?: string
}

const Context = React.createContext<SessionContext>({
  appsEnabled: undefined,
  ca: undefined,
  core: undefined,
  editor: undefined,
  oboTeamId: undefined,
  setOboTeamId: undefined,
  settings: undefined,
  sealedSecretsPEM: undefined,
  user: {
    teams: undefined,
    name: undefined,
    email: undefined,
    isPlatformAdmin: undefined,
    isTeamAdmin: undefined,
    roles: undefined,
    authz: undefined,
    sub: undefined,
  },
  defaultPlatformAdminEmail: undefined,
  versions: undefined,
})

export const useSession = (): SessionContext => useContext(Context)

interface Props {
  children: any
}

export default function SessionProvider({ children }: Props): React.ReactElement {
  const { pathname } = useLocation()
  const skipFetch = pathname === '/logout' || pathname === '/platform-logout'
  const [oboTeamId, setOboTeamId] = useLocalStorage<string>('oboTeamId', undefined)
  const {
    data: session,
    isLoading: isLoadingSession,
    refetch: refetchSession,
    error: sessionError,
  } = useGetSessionQuery(skipFetch && skipToken)
  const {
    data: settings,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
  } = useGetSettingsInfoQuery(skipFetch && skipToken)
  const {
    data: apps,
    isLoading: isLoadingApps,
    refetch: refetchAppsEnabled,
  } = useGetAppsQuery({ teamId: oboTeamId, picks: ['id', 'enabled'] }, { skip: !oboTeamId })
  const { data: apiDocs, isLoading: isLoadingApiDocs } = useV1ApiDocsQuery(skipFetch && skipToken)
  const appsEnabled = (apps || []).reduce((memo, a) => {
    memo[a.id] = !!a.enabled
    return memo
  }, {})
  const { isDirty } = useAppSelector(({ global: { isDirty } }) => ({ isDirty }))
  const ctx = useMemo(
    () => ({
      ...(session || {}),
      appsEnabled,
      oboTeamId,
      refetchAppsEnabled,
      refetchSession,
      refetchSettings,
      setOboTeamId,
      settings,
    }),
    [appsEnabled, oboTeamId, session, settings],
  )
  const { editor, user } = ctx
  const { isPlatformAdmin, teams } = user || {}
  const { t } = useTranslation()
  const [keys] = useState<Record<string, SnackbarKey | undefined>>({})
  const closeKey = (key) => {
    if (!keys[key]) return
    snack.close(keys[key])
    delete keys[key]
  }
  // separate one for isDirty so we can be sure only that has changed
  useEffect(() => {
    if (isDirty === undefined) return
    if (!editor && isDirty === null) {
      keys.create = snack.info(`${t('Processing... Hold on!')}`, {
        key: keys.create,
        persist: true,
        onClick: () => {
          closeKey('create')
        },
      })
    } else if (isDirty !== null) closeKey('create')
    if (isDirty) refetchSession()
  }, [isDirty])

  // END HOOKS
  if (isLoadingSession) return <LoadingScreen />
  // if an error occured we keep rendering and let the error component show what happened
  // no error and we stopped loading, so we can check the user
  if (sessionError) {
    const { originalStatus, status, data } = sessionError as any
    if (originalStatus === 503) throw new ApiErrorServiceUnavailable()
    if (originalStatus === 504) throw new ApiErrorGatewayTimeout()
    // return the logout page if the error is a fetch error (session expired)
    if (status === 'FETCH_ERROR') return <Logout fetchError />
    // if we have a session error which not fits the above, we throw a generic error
    const errorMessage: string = data?.error || data || 'Session error'
    const errorCode: number = originalStatus || status || 500
    throw new HttpError(errorMessage, errorCode)
  }
  if (!session?.user?.isPlatformAdmin && session?.user?.teams?.length === 0) throw new ApiErrorUnauthorizedNoGroups()
  if (isLoadingApiDocs || isLoadingApps || isLoadingSession || isLoadingSettings) return <LoadingScreen />
  if (apiDocs) setSpec(apiDocs)
  // set obo to first team if not set
  if (!isPlatformAdmin && !teams?.includes(oboTeamId)) setOboTeamId(undefined)
  if (!oboTeamId) {
    if (isPlatformAdmin) setOboTeamId('admin')
    else if (!isPlatformAdmin) {
      if (teams?.length) {
        setOboTeamId(teams[0])
        return <LoadingScreen />
      }
      throw new ApiErrorUnauthorized()
    }
  }
  return <Context.Provider value={ctx}>{children}</Context.Provider>
}
