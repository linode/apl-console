import { setSpec } from 'common/api-spec'
import ErrorComponent from 'components/Error'
import Loader from 'components/Loader'
import { useLocalStorage } from 'hooks/useLocalStorage'
import React, { JSXElementConstructor, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

export default function SessionProvider({ children }: Props): React.ReactElement {
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  const { data: session, isLoading: isLoadingSession, error: errorSession, isSuccess: okSession } = useGetSessionQuery()
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
      // eslint-disable-next-line no-nested-ternary
      editor: lastDbMessage ? (lastDbMessage.state === 'dirty' ? lastDbMessage.editor : undefined) : session?.editor,
    }),
    [appsEnabled, oboTeamId, session, settings],
  )
  const { editor, user } = ctx
  const { email, isAdmin, teams } = user || {}
  const { t } = useTranslation()
  const [closeKey, setCloseKey] = useState<ReactElement<any, string | JSXElementConstructor<any> | undefined>>()
  const [readyKey, setReadyKey] = useState<ReactElement<any, string | JSXElementConstructor<any> | undefined>>()
  useEffect(() => {
    if (editor && editor === email) {
      snack.warning(
        t(
          'You started editing, thereby blocking others. By choosing "Revert" (or after 10 minutes of inactivity) changes will be reverted to give others access.',
          { editor },
        ),
        { autoHideDuration: 6000 },
      )
    }
    if (editor && editor !== email) {
      if (readyKey) {
        snack.close(readyKey)
        setReadyKey(undefined)
      }

      if (!closeKey) {
        setCloseKey(
          snack.warning(
            t('User {{editor}} is already editing. Console is read-only until user finishes.', { editor }),
            {
              persist: true,
              onClick: () => {
                snack.close(closeKey)
                setCloseKey(undefined)
              },
            },
          ),
        )
      }
    }
    if (lastDbMessage && lastDbMessage.editor !== email && lastDbMessage?.state === 'clean') {
      if (closeKey) {
        snack.close(closeKey)
        setCloseKey(undefined)
      }
      if (lastDbMessage.reason === 'deploy') {
        snack.info(
          t('User {{editor}} has deployed changes. Reloading, hold on!', {
            editor: lastDbMessage.editor,
            reason: lastDbMessage.reason,
          }),
          {
            persist: true,
          },
        )

        setTimeout(() => window.location.reload(), 4000)
      } else if (!readyKey) {
        setReadyKey(
          snack.info(
            t('User {{editor}} is done editing (reason: {{reason}}). Console is unblocked.', {
              editor: lastDbMessage.editor,
              reason: lastDbMessage.reason,
            }),
            {
              persist: true,
            },
          ),
        )
      }
    }

    if (!editor && closeKey) {
      snack.close(closeKey)
      setCloseKey(undefined)
    }
  }, [session, lastDbMessage, editor])

  // END HOOKS

  // if (error.code === 504) err = <ErrorComponent error={new ApiErrorGatewayTimeout()} />
  // else err = <ErrorComponent error={error} />
  if (isLoadingSession) return <Loader />
  if (!isLoadingSession && !errorSession && !session.user.isAdmin && session.user.teams.length === 0)
    return <ErrorComponent error={new ApiErrorUnauthorizedNoGroups()} />

  const error = errorApps || errorSession || errorApiDocs || errorSettings
  if (error) return <ErrorComponent error={new ApiErrorGatewayTimeout()} />

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
