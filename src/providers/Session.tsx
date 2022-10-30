import { Link } from '@mui/material'
import { setSpec } from 'common/api-spec'
import { useMainStyles } from 'common/theme'
import ErrorComponent from 'components/Error'
import Loader from 'components/Loader'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { SnackbarKey } from 'notistack'
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
import { setCorrupt } from 'redux/reducers'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { getCommitLink } from 'utils/data'
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
  reason: 'deploy' | 'revert' | 'restore' | 'conflict'
  sha: string
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
  const { classes } = useMainStyles()
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
  const gitHost = `https://gitea.${settings?.cluster?.domainSuffix}/otomi/values.git`
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

    // initiated by self
    if (isMsgEditor) {
      if (state === 'corrupt' && reason === 'deploy' && !keys.conflict) {
        keys.conflict = snack.error(t('Deployment conflict. You have to revert changes and try again!'), {
          persist: true,
          onClick: () => {
            closeKey('conflict')
          },
        })
      }
      if (state === 'clean' && reason === 'revert') snack.success(t(`DB reverted to commit {{sha}}`, { sha }))
    }

    // initiated by others
    if (!isMsgEditor) {
      if (state === 'dirty') snack.warning(t('User {{editor}} started editing.', { editor: msgEditor }))
      if (state === 'clean') {
        if (reason === 'deploy')
          if (editor) snack.warning(t('You have undeployed changes. Potential conflict upon deploy!'))

        if (reason === 'revert') {
          snack.info(
            t('User {{editor}} stopped editing (reason: {{reason}}).', {
              editor: msgEditor,
              reason,
            }),
          )
        }
      }
    }

    // global messages
    if (state === 'corrupt' && reason === 'conflict') {
      if (keys.conflict) closeKey('conflict')
      keys.conflict = snack.error(t('Git conflict: upstream changes. Admin must restore DB.'), {
        persist: true,
        onClick: () => {
          closeKey('conflict')
        },
      })
      setCorrupt(true)
    }
    if (state === 'clean' && reason === 'deploy') {
      if (keys.deploy) closeKey('deploy')
      keys.deploy = snack.info(
        <>
          {t(`Deployment scheduled for commit: `)}&nbsp;
          <Link
            target='_blank'
            rel='noopener'
            color='inherit'
            className={classes.toastLink}
            href={getCommitLink(sha, gitHost)}
          >
            {sha}
          </Link>
        </>,
        { key: keys.deploy },
      )
      setCorrupt(false)
    }
    if (state === 'clean' && reason === 'restore') {
      if (keys.restore) closeKey('restore')
      keys.restore = snack.success(t(`DB restored to commit: {{sha}}`, { sha }), {
        persist: true,
        onClick: () => {
          closeKey('restore')
        },
      })
      setCorrupt(false)
    }
  }, [lastDbMessage])
  // separate one for isDirty so we can be sure only that has changed
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== undefined) {
      refetchSession()
      if (keys.create && (!editor || !isDirty)) closeKey('create')
      if (isDirty) keys.create = snack.info(t('Created in memory database for the session.'))
    }
  }, [isDirty])
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
  // TODO: create from git config, which is now in otomi-api values. Move?
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
