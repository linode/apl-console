import Shortcuts from 'components/Shortcuts'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGetAppsQuery } from 'store/otomi'
import { getAppData } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const session = useAuthzSession(teamId)
  const { data: apps, isLoading, error } = useGetAppsQuery({ teamId })
  // END HOOKS
  const appsWithShortcuts = (apps || [])
    .map((app) => getAppData(session, teamId, app, true))
    .filter((a) => a.shortcuts?.length)
    .reduce((memo, app) => {
      // flatten
      app.shortcuts.forEach((s) => memo.push({ ...app, shortcut: s, description: s.description }))
      return memo
    }, [])
  const comp = !(isLoading || error) && apps && <Shortcuts teamId={teamId} apps={appsWithShortcuts} />
  return <PaperLayout loading={isLoading} comp={comp} />
}
