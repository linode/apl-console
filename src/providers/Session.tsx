import { setSpec } from 'common/api-spec'
import ErrorComponent from 'components/Error'
import LinkCommit from 'components/LinkCommit'
import LoadingScreen from 'components/LoadingScreen'
import MessageDrone from 'components/MessageDrone'
import MessageTrans from 'components/MessageTrans'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { ProviderContext, SnackbarKey } from 'notistack'
import React, { useContext, useEffect, useMemo, useState } from 'react'
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
import { ApiErrorUnauthorized, ApiErrorUnauthorizedNoGroups } from 'utils/error'
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
  user: {
    teams: undefined,
    name: undefined,
    email: undefined,
    isAdmin: undefined,
    roles: undefined,
    authz: undefined,
    sub: undefined,
  },
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
  const { data: session, isLoading: isLoadingSession, refetch: refetchSession } = useGetSessionQuery()
  const url = `${window.location.origin.replace(/^http/, 'ws')}`
  const path = '/api/ws'
  const {
    data: settings,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
  } = useGetSettingsQuery({ ids: ['cluster', 'dns', 'otomi'] })
  const {
    data: apps,
    isLoading: isLoadingApps,
    refetch: refetchAppsEnabled,
  } = useGetAppsQuery({ teamId: 'admin', picks: ['id', 'enabled'] })
  const { data: apiDocs, isLoading: isLoadingApiDocs, error: errorApiDocs } = useApiDocsQuery()
  const { socket, error: errorSocket } = useSocket({ url, path })
  console.log('socket', socket)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { lastMessage: lastDbMessage } = useSocketEvent<DbMessage>(socket, 'db')
  console.log('lastDbMessage', lastDbMessage)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const { lastMessage: lastDroneMessage } = useSocketEvent<DroneBuildEvent>(socket, 'drone')
  console.log('lastDroneMessage', lastDroneMessage)
  const { lastMessage: lastTektonMessage } = useSocketEvent<any>(socket, 'tekton')
  console.log('lastTektonMessage', lastTektonMessage)
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
  const { corrupt, editor, user } = ctx
  const { email, isAdmin, teams } = user || {}
  const { t } = useTranslation()
  const [keys] = useState<Record<string, SnackbarKey | undefined>>({})
  const closeKey = (key) => {
    if (!keys[key]) return
    snack.close(keys[key])
    delete keys[key]
  }
  useEffect(() => {
    if (!lastDbMessage) return
    const { editor: msgEditor, state, reason, sha } = lastDbMessage
    const isMsgEditor = msgEditor === email
    const linkCommit = sha ? <LinkCommit domainSuffix={settings.cluster.domainSuffix} sha={sha} short /> : null

    // initiated by self
    if (isMsgEditor) {
      if (state === 'clean' && reason === 'revert')
        snack.success(<MessageTrans defaults='DB reverted to commit <0></0>' components={[linkCommit]} />)
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
        if (reason === 'conflict') {
          snack.info(
            `${t('DB updated to latest commit (reason: {{reason}}).', {
              editor: 'system',
              reason,
            })}`,
          )
        }
        if (reason === 'restored') {
          snack.info(
            `${t('DB restored to commit (reason: {{reason}}).', {
              editor: 'system',
              reason,
            })}`,
          )
        }
      }
    }

    // global messages
    if (state === 'clean' && reason === 'revert') {
      closeKey('conflict')
      refetchSession()
    }
    if (state === 'corrupt' && reason === 'deploy') refetchSession()
    if (state === 'clean' && reason === 'deploy') {
      closeKey('deploy')
      keys.deploy = snack.info(
        <MessageTrans defaults='Deployment scheduled for commit <0></0>' components={[linkCommit]} />,
        { key: keys.deploy },
      )
      refetchSession()
    }
    if (state === 'clean' && reason === 'restore') {
      closeKey('conflict')
      keys.restore = snack.success(<MessageTrans defaults='DB restored to commit <0><0>' components={[linkCommit]} />, {
        persist: true,
        onClick: () => {
          closeKey('restore')
        },
      })
      refetchSession()
    }
  }, [lastDbMessage])
  // special one for corrupt state
  useEffect(() => {
    if (corrupt) {
      keys.conflict = snack.error(`${t('Git conflict: upstream changes. Admin must restore DB.')}`, {
        persist: true,
        onClick: () => {
          closeKey('conflict')
        },
      })
    } else closeKey('conflict')
  }, [corrupt])
  // separate one for isDirty so we can be sure only that has changed
  useEffect(() => {
    if (isDirty === undefined) return
    if (!editor && isDirty === null) {
      keys.create = snack.info(`${t('Cloning DB for the session... Hold on!')}`, {
        key: keys.create,
        persist: true,
        onClick: () => {
          closeKey('create')
        },
      })
    } else if (isDirty !== null) closeKey('create')
    if (isDirty) refetchSession()
  }, [isDirty])
  // Drone events
  useEffect(() => {
    if (!lastDroneMessage) return
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('lastDroneMessage: ', lastDroneMessage)
    }
    const domainSuffix = settings?.cluster?.domainSuffix
    const { action, build } = lastDroneMessage
    const { after: sha, created, id, status, updated } = build
    const interest = [
      { type: 'info', cond: action === 'created' && status === 'pending', time: created },
      { type: 'error', cond: action === 'updated' && status === 'failed', time: updated },
      { type: 'success', cond: action === 'updated' && status === 'success', time: updated },
    ]
    interest.forEach((msg) => {
      const datetime = new Date(msg.time).toLocaleTimeString(window.navigator.language)
      if (!msg.cond) return
      keys[`drone-${msg.type}`] = (snack[msg.type] as ProviderContext['enqueueSnackbar'])(
        <MessageDrone {...{ datetime, domainSuffix, id, sha, status }} />,
      )
      // pull in latest state as it might have changed
      if (status !== 'pending') refetchSession()
    })
  }, [lastDroneMessage])

  // Tekton events
  useEffect(() => {
    if (!lastTektonMessage) return
    const domainSuffix = settings?.cluster?.domainSuffix
    const { lastPipelineName } = lastTektonMessage
    keys.tekton = snack.info(<MessageTrans defaults={`Tekton ${lastPipelineName}`} />, { key: keys.tekton })
  }, [lastTektonMessage])
  // END HOOKS
  if (isLoadingSession) return <LoadingScreen />
  // if an error occured we keep rendering and let the error component show what happened
  if (errorSocket)
    keys.socket = snack.warning(`${t('Could not establish socket connection. Retrying...')}`, { key: keys.socket })
  // no error and we stopped loading, so we can check the user
  if (!session.user.isAdmin && session.user.teams.length === 0)
    return <ErrorComponent error={new ApiErrorUnauthorizedNoGroups()} />
  if (isLoadingApiDocs || isLoadingApps || isLoadingSession || isLoadingSettings) return <LoadingScreen />
  if (apiDocs) setSpec(apiDocs)
  // set obo to first team if not set
  if (!isAdmin && !teams.includes(oboTeamId)) setOboTeamId(undefined)
  if (!oboTeamId) {
    if (isAdmin) setOboTeamId('admin')
    else if (!isAdmin) {
      if (teams.length) {
        setOboTeamId(teams[0])
        return <LoadingScreen />
      }
      return <ErrorComponent error={new ApiErrorUnauthorized()} />
    }
  }
  return <Context.Provider value={ctx}>{children}</Context.Provider>
}
