import Apps from 'components/Apps'
import useApi, { useAuthz } from 'hooks/useApi'
import MainLayout from 'layouts/Empty'
import { find } from 'lodash'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthz(teamId)
  const [appState, setAppState] = useState([])
  const [appIds, appEnabled] = appState
  const [adminApps, adminAppsloading]: any = useApi('getApps', !appIds, ['admin'])
  const [teamApps, teamAppsLoading]: any = useApi('getApps', teamId !== 'admin', [teamId])
  // map apps and set enabled to the one from adminApps
  const apps =
    (teamId !== 'admin' &&
      !teamAppsLoading &&
      teamApps &&
      teamApps.map((a) => {
        a.enabled = find(adminApps, (t) => t.id === a.id).enabled
        return a
      })) ||
    (teamId === 'admin' && !adminAppsloading && adminApps)
  const [editRes, editing, editError]: any = useApi('toggleApps', !!appIds, [
    teamId,
    { ids: appIds, enabled: appEnabled },
  ])
  // END HOOKS
  if (appIds && !editing) {
    setTimeout(() => {
      setAppState([])
    })
  }
  return (
    <MainLayout>
      <Apps teamId={teamId} apps={apps} setAppState={setAppState} loading={adminAppsloading || teamAppsLoading} />
    </MainLayout>
  )
}
