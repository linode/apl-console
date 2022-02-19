import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useSession } from 'common/session-context'
import { getAppData } from 'utils/data'
import Shortcuts from 'components/Shortcuts'
import useApi, { useAuthz } from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const session = useSession()
  const { tid } = useAuthz(teamId)
  const [apps, loading, err]: any = useApi('getApps', true, [tid])
  const appsWithShortcuts = (apps || [])
    .map(app => getAppData(session, teamId, app, true))
    .filter(a => a.shortcuts?.length)
    .reduce((memo, app) => {
      // flatten
      app.shortcuts.forEach(s => memo.push({ ...app, shortcut: s, description: s.description }))
      return memo
    }, [])
  const comp = !(err || loading) && <Shortcuts teamId={teamId} apps={appsWithShortcuts} />
  return <PaperLayout loading={loading} comp={comp} />
}
