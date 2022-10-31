import { setSpec } from 'common/api-spec'
import ErrorComponent from 'components/Error'
import LinkCommit from 'components/LinkCommit'
import Loader from 'components/Loader'
import MessageDrone from 'components/MessageDrone'
import MessageTrans from 'components/MessageTrans'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { ProviderContext, SnackbarKey } from 'notistack'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import {
  GetSessionApiResponse,
  GetSettingsApiResponse,
  useApiDocsQuery,
  useGetAppsQuery,
  useGetSessionQuery,
  useGetSettingsQuery,
} from 'redux/otomiApi'
import { setCorrupt } from 'redux/reducers'
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
  state: 'clean' | 'corrupt' | 'dirty'
  editor: string
  reason: 'deploy' | 'revert' | 'restore' | 'conflict' | 'started' | 'restored' | 'reloaded'
  sha: string
}

type DroneRepo = {
  id: string
}
type DroneBuild = {
  after: string
  id: string
  link: string
  status: 'pending' | 'started' | 'success' | 'failed'
  timestamp: number
  created: number
  started: number
  updated: number
  finished: number
}
type DroneBuildEvent = {
  id: number
  action: 'created' | 'updated' | 'completed'
  event: 'build' | 'repo'
  repo: DroneRepo
  build: DroneBuild
}

export default function SessionProvider({ children }: Props): React.ReactElement {
  const [oboTeamId, setOboTeamId] = useLocalStorage<string>('oboTeamId', undefined)
  const {
    data: session,
    isLoading: isLoadingSession,
    error: errorSession,
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
  const { corrupt, editor, user } = ctx
  const { email, isAdmin, teams } = user || {}
  const { t } = useTranslation()
  const [keys] = useState<Record<string, SnackbarKey | undefined>>({})
  const closeKey = (key) => {
    if (!keys[key]) return
    snack.close(keys[key])
    delete keys[key]
  }
  const { isCorrupt, isDirty } = useAppSelector(({ global: { isCorrupt, isDirty } }) => ({
    isCorrupt,
    isDirty,
  }))
  useEffect(() => {
    if (!lastDbMessage) return
    const { editor: msgEditor, state, reason, sha } = lastDbMessage
    const isMsgEditor = msgEditor === email
    const linkCommit = sha ? <LinkCommit sha={sha} short /> : null

    // initiated by self
    if (isMsgEditor) {
      if (state === 'corrupt' && reason === 'deploy' && !keys.conflict) {
        closeKey('deploy')
        keys.deploy = snack.error(`${t('Deployment conflict. You have to revert changes and try again!')}`, {
          persist: true,
          onClick: () => {
            closeKey('deploy')
          },
        })
      }
      if (state === 'clean' && reason === 'revert') {
        snack.success(
          <MessageTrans defaults='DB reverted to commit <1></1>'>
            DB reverted to commit <LinkCommit sha={sha} />
          </MessageTrans>,
        )
      }
    }

    // initiated by others
    if (!isMsgEditor) {
      if (state === 'dirty') snack.warning(`${t('User {{editor}} started editing.', { editor: msgEditor })}`)
      if (state === 'clean') {
        if (reason === 'deploy')
          if (editor) snack.warning(`${t('You have undeployed changes. Potential conflict upon deploy!')}`)

        if (reason === 'revert') {
          snack.info(
            `${t('User {{editor}} stopped editing (reason: {{reason}}).', {
              editor: msgEditor,
              reason,
            })}`,
          )
        }
      }
    }

    // global messages
    if (state === 'clean' && reason === 'deploy') {
      if (keys.deploy) closeKey('deploy')
      keys.deploy = snack.info(
        <Trans defaults='Deployment scheduled for commit: <0></0>' components={[linkCommit]} />,
        { key: keys.deploy },
      )
      setCorrupt(false)
    }
    if (state === 'clean' && reason === 'restore') {
      if (keys.restore) closeKey('restore')
      keys.restore = snack.success(<Trans defaults='DB restored to commit: <0><0>' components={[linkCommit]} />, {
        persist: true,
        onClick: () => {
          closeKey('restore')
        },
      })
      setCorrupt(false)
    }
  }, [lastDbMessage])
  // special one for corrupt state
  useEffect(() => {
    if (!(corrupt || isCorrupt)) return
    if (keys.conflict) closeKey('conflict')
    keys.conflict = snack.error(`${t('Git conflict: upstream changes. Admin must restore DB.')}`, {
      persist: true,
      onClick: () => {
        closeKey('conflict')
      },
    })
  }, [corrupt, isCorrupt])
  // separate one for isDirty so we can be sure only that has changed
  useEffect(() => {
    if (isDirty === undefined) return
    if (isDirty === null)
      keys.create = snack.info(`${t('Cloning DB for the session... Hold on!')}`, { key: keys.create })
    else {
      refetchSession()
      if (keys.create && !isDirty) closeKey('create')
    }
  }, [isDirty])
  // Drone events
  useEffect(() => {
    if (!lastDroneMessage) return
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV !== 'production') console.log('lastDroneMessage: ', lastDroneMessage)
    const domainSuffix = settings?.cluster?.domainSuffix
    const { action, build } = lastDroneMessage
    const { after: sha, id, status, started, finished } = build
    const interest = [
      { type: 'info', cond: action === 'created' && status === 'pending', time: started },
      { type: 'error', cond: action === 'updated' && status === 'failed', time: finished },
      { type: 'success', cond: action === 'updated' && status === 'success', time: finished },
    ]
    interest.forEach((msg) => {
      const datetime = new Date(msg.time).toLocaleTimeString()
      if (!msg.cond) return
      ;(snack[msg.type] as ProviderContext['enqueueSnackbar'])(
        <MessageDrone {...{ datetime, domainSuffix, id, sha, status }} />,
      )
    })
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
