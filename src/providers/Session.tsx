import { setSpec } from 'common/api-spec'
import ErrorComponent from 'components/Error'
import Loader from 'components/Loader'
import { useLocalStorage } from 'hooks/useLocalStorage'
import React, { JSXElementConstructor, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import {
  GetSessionApiResponse,
  GetSettingsApiResponse,
  useApiDocsQuery,
  useGetAppsQuery,
  useGetSessionQuery,
  useGetSettingsQuery,
} from 'redux/otomiApi'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { ApiErrorGatewayTimeout, ApiErrorUnauthorized, ApiErrorUnauthorizedNoGroups } from 'utils/error'
import snack from 'utils/snack'

export interface SessionContext extends GetSessionApiResponse {
  appsEnabled?: Record<string, any>
  editor?: string
  oboTeamId?: string
  setOboTeamId?: CallableFunction
  refetchAppsEnabled?: () => void
  refetchSession?: () => void
  refetchSettings?: () => void
  settings?: GetSettingsApiResponse
}

const Context = React.createContext<SessionContext>({
  appsEnabled: undefined,
  ca: undefined,
  core: undefined,
  editor: undefined,
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

type DbMessage = {
  state: string
  editor: string
  reason: string
}

type DroneRepo = {
  id: string
}
type DroneBuild = {
  id: string
  status: string
  timestamp: number
}
type DroneBuildEvent = {
  id: number
  action: string
  repo: DroneRepo
  build: DroneBuild
}

export default function SessionProvider({ children }: Props): React.ReactElement {
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  const {
    data: session,
    isLoading: isLoadingSession,
    error: errorSession,
    isSuccess: okSession,
    refetch: refetchSession,
  } = useGetSessionQuery()
  const url = `${window.location.origin.replace(/^http/, 'ws')}`
  const path = '/api/ws'
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
  const { socket, error: errorSocket } = useSocket({ url, path })
  const { lastMessage: lastDbMessage } = useSocketEvent<DbMessage>(socket, 'db')
  const { lastMessage: lastDroneMessage } = useSocketEvent<DroneBuildEvent>(socket, 'drone')
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
      refetchSession,
      refetchSettings,
      setOboTeamId,
      settings,
    }),
    [appsEnabled, oboTeamId, session, settings],
  )
  const { editor, user } = ctx
  const { email, isAdmin, teams } = user || {}
  const { t } = useTranslation()
  const [keys, _] = useState<Record<string, ReactElement<any, string | JSXElementConstructor<any> | undefined>>>({})
  const closeKey = (key) => {
    if (!keys[key]) return
    snack.close(keys[key])
    delete keys[key]
  }
  useEffect(() => {
    if (
      editor &&
      editor === email &&
      lastDbMessage &&
      lastDbMessage.state === 'clean' &&
      lastDbMessage.reason === 'corrupt' &&
      !keys.conflict
    ) {
      keys.conflict = snack.error(t('Deployment conflict. You have to revert changes and try again!'), {
        persist: true,
        onClick: () => {
          closeKey('conflict')
        },
      })
    }

    if (lastDbMessage && lastDbMessage.editor !== email && lastDbMessage?.state === 'dirty')
      snack.warning(t('User {{editor}} started editing.', { editor: lastDbMessage.editor }))

    if (lastDbMessage && lastDbMessage.editor !== email && lastDbMessage?.state === 'clean') {
      if (lastDbMessage.reason === 'deploy') {
        snack.info(
          t('User {{editor}} has deployed changes.', {
            editor: lastDbMessage.editor,
          }),
        )
        if (editor) snack.warning(t('You have undeployed changes. Potential conflict upon deploy!'))

        refetchSession()
      } else if (lastDbMessage.reason === 'revert') {
        snack.info(
          t('User {{editor}} stopped editing (reason: {{reason}}).', {
            editor: lastDbMessage.editor,
            reason: lastDbMessage.reason,
          }),
        )
      }
    }
    if (isDirty) {
      refetchSession()
      if (!editor) snack.info(t('Creating in memory database for the session. Hold on!.'))
    }

    // return () => {
    //   Object.keys(keys).forEach(closeKey)
    // }
  }, [isDirty, session, lastDbMessage, editor])
  // Drone events
  useEffect(() => {
    if (!lastDroneMessage) return
    const { action, repo, build } = lastDroneMessage
    const { id, status, timestamp } = build
    snack[status === 'failed' ? 'error' : 'info'](
      t(`Drone build ${id} ${action} at ${new Date(timestamp).toLocaleTimeString()}, status changed to: ${status}`),
    )
  }, [lastDroneMessage])
  // END HOOKS
  const error = errorApiDocs || errorApps || errorSession || errorSettings || errorSocket
  if (isLoadingSession) return <Loader />
  // if an error is caught at this stage related to api, we assume it is not responding and return timeout error
  if (error) return <ErrorComponent error={new ApiErrorGatewayTimeout()} />
  // no error and we stopped loading, so we can check the user
  if (!session.user.isAdmin && session.user.teams.length === 0)
    return <ErrorComponent error={new ApiErrorUnauthorizedNoGroups()} />
  if (isLoadingApiDocs || isLoadingApps || isLoadingSession || isLoadingSettings) return <Loader />
  if (apiDocs) setSpec(apiDocs)
  // set obo to first team if not set
  if (!isAdmin && !teams.includes(oboTeamId)) setOboTeamId(undefined)
  if (!oboTeamId) {
    if (isAdmin) setOboTeamId('admin')
    else if (!isAdmin) {
      if (teams.length) {
        setOboTeamId(teams[0])
        return <Loader />
      }
      return <ErrorComponent error={new ApiErrorUnauthorized()} />
    }
  }
  return <Context.Provider value={ctx}>{children}</Context.Provider>
}
