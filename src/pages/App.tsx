import App from 'components/App'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { renameKeys } from 'utils/data'

interface Params {
  teamId: string
  appId: string
}

export default function ({
  match: {
    params: { teamId, appId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [formData, setFormdata] = useState()
  const [appState, setAppState] = useState([])
  const [appIds, appEnabled] = appState
  const [app, appLoading, appError]: any = useApi('getApp', !appIds, [teamId, appId])
  const [, editLoading, editError] = useApi('editApp', !!formData, [teamId, appId, renameKeys(formData)])
  const [toggleRes, toggling, toggleError]: any = useApi('toggleApps', !!appIds, [
    teamId,
    { ids: appIds, enabled: appEnabled },
  ])
  // END HOOKS
  if (appIds && !toggling) setTimeout(() => setAppState([]))
  const loading = appLoading || editLoading
  const err = appError || editError
  const comp = !loading && (!err || formData || app) && (
    <App onSubmit={setFormdata} id={appId} {...(formData || app)} teamId={teamId} setAppState={setAppState} />
  )
  return <PaperLayout comp={comp} loading={loading} />
}
