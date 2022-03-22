import { useSession } from 'common/session-context'
import Shortcuts from 'components/Shortcuts'
import useApi, { useAuthz } from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { getAppData } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const session = useSession()
  useAuthz(teamId)
  const [adminApps, adminAppsloading, adminAppsErr]: any = useApi('getApps', true, ['admin'])
  const [teamApps, teamAppsLoading, teamAppsErr]: any = useApi('getApps', teamId !== 'admin', [teamId])
  const apps = (teamId !== 'admin' && teamApps) || (teamId === 'admin' && adminApps)
  const loading = adminAppsloading || teamAppsLoading
  const err = adminAppsErr || teamAppsErr
  const appsWithShortcuts = (apps || [])
    .map((app) => getAppData(session, teamId, app, true))
    .filter((a) => a.shortcuts?.length)
    .reduce((memo, app) => {
      // flatten
      app.shortcuts.forEach((s) => memo.push({ ...app, shortcut: s, description: s.description }))
      return memo
    }, [])
  const comp = !(err || loading) && <Shortcuts teamId={teamId} apps={appsWithShortcuts} />
  return <PaperLayout loading={loading} comp={comp} />
}
