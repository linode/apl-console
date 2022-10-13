import { setSpec } from 'common/api-spec'
import ErrorComponent from 'components/Error'
import Loader from 'components/Loader'
import { useLocalStorage } from 'hooks/useLocalStorage'
import React, { JSXElementConstructor, ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
}

export default function SessionProvider({ children }: Props): React.ReactElement {
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  const dispatch = useAppDispatch()
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
      isDirty: session?.isDirty || lastDbMessage?.state === 'dirty',
      editor: lastDbMessage ? lastDbMessage.editor : session?.editor,
    }),
    [appsEnabled, oboTeamId, session, settings],
  )
  const oldDirty = useSelector(({ global }: ReducerState) => global.isDirty)
  useEffect(() => {
    // when the UI dirty flag changes on the server, and it has changed from local state, will we dispatch
    if (session && oldDirty !== session.isDirty) dispatch(setDirty(session.isDirty))
  }, [session])
  const { t } = useTranslation()
  const [lastEditor, setLastEditor] = useState<string | undefined>(session?.editor)
  const [closeKey, setCloseKey] = useState<ReactElement<any, string | JSXElementConstructor<any> | undefined>>()
  const [readyKey, setReadyKey] = useState<ReactElement<any, string | JSXElementConstructor<any> | undefined>>()
  useEffect(() => {
    if (lastDbMessage && lastDbMessage.editor !== lastEditor) setLastEditor(lastDbMessage.editor)
  }, [lastDbMessage])
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
  const {
    editor,
    user: { email, isAdmin, teams },
  } = ctx
  // messages
  socket.on('connection', (socket) => {
    console.log('a user connected')
    snack.info(t('Another user just logged into the console.'))
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
  if (editor && editor !== email) {
    if (!closeKey) {
      setCloseKey(
        snack.warning(t('User {{editor}} is already editing. Console is read-only until user finishes.', { editor }), {
          persist: true,
          onClick: () => {
            snack.close(closeKey)
          },
        }),
      )
    }
  }
  if (!editor && closeKey) snack.close(closeKey)
  if (lastEditor && lastEditor !== email && !lastDbMessage?.editor) {
    if (!readyKey) {
      setReadyKey(
        snack.info(t('User {{editor}} is done editing. Console is unblocked.', { editor }), {
          persist: true,
          onClick: () => {
            snack.close(readyKey)
          },
        }),
      )
    }
  }

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
