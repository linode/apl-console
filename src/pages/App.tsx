/* eslint-disable @typescript-eslint/no-floating-promises */
import App from 'components/App'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useEditAppMutation, useGetAppQuery, useToggleAppsMutation } from 'store/otomi'
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
  const { refetchAppsEnabled } = useSession()
  const [formData, setFormData] = useState()
  const [appState, setAppState] = useState([])
  const [appIds, appEnabled] = appState
  const { data, isLoading, error, refetch } = useGetAppQuery({ teamId, appId })
  const [edit, { isLoading: editLoading }] = useEditAppMutation()
  const [toggle, { isLoading: toggleLoading }] = useToggleAppsMutation()
  // END HOOKS
  if (formData) {
    edit({ teamId, appId, body: renameKeys(formData) })
    setFormData(undefined)
  }
  if (appIds) {
    toggle({ teamId, body: { ids: appIds, enabled: appEnabled } })
    setAppState([])
  }
  if (editLoading || toggleLoading) {
    setTimeout(refetch)
    setTimeout(refetchAppsEnabled)
  }
  const useData = formData || data
  const comp = !(isLoading || error) && useData && (
    <App onSubmit={setFormData} id={appId} {...useData} teamId={teamId} setAppState={setAppState} />
  )
  return <PaperLayout comp={comp} loading={isLoading} />
}
