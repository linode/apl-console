/* eslint-disable @typescript-eslint/no-floating-promises */
import App from 'components/App'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useEditAppMutation, useGetAppQuery, useToggleAppsMutation } from 'store/otomi'

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
  const [edit, { isSuccess: okEdit }] = useEditAppMutation()
  const [toggle, { isSuccess: okToggle }] = useToggleAppsMutation()
  useEffect(() => {
    if (formData) {
      setFormData(undefined)
      edit({ teamId, appId, body: formData })
    }
    if (appIds) {
      setAppState([])
      toggle({ teamId, body: { ids: appIds, enabled: appEnabled } })
    }
    if (okEdit || okToggle) {
      refetch()
      refetchAppsEnabled()
    }
  }, [formData, appIds, okEdit, okToggle])
  // END HOOKS
  const useData = formData || data
  const comp = !(isLoading || error) && useData && (
    <App onSubmit={setFormData} id={appId} {...useData} teamId={teamId} setAppState={setAppState} />
  )
  return <PaperLayout comp={comp} loading={isLoading} />
}
