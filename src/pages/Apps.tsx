/* eslint-disable @typescript-eslint/no-floating-promises */
import Apps from 'components/Apps'
import useAuthzSession from 'hooks/useAuthzSession'
import MainLayout from 'layouts/Empty'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGetAppsQuery, useToggleAppsMutation } from 'redux/otomiApi'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { refetchAppsEnabled } = useAuthzSession(teamId)
  const [appState, setAppState] = useState([])
  const [appIds, appEnabled] = appState
  const { data: apps, isLoading, isFetching, refetch } = useGetAppsQuery({ teamId })
  const [toggle, { isSuccess: okToggle }] = useToggleAppsMutation()
  useEffect(() => {
    if (appIds) {
      setAppState([])
      toggle({ teamId, body: { ids: appIds, enabled: appEnabled } })
    }
    if (okToggle) {
      // we wish to refetch settings kept in the session for the UI state
      // IMPORTANT: we have to use setTimeout to avoid concurrent state update
      refetch()
      setTimeout(refetchAppsEnabled)
    }
  }, [appIds, okToggle])
  // END HOOKS
  return (
    <MainLayout>
      <Apps teamId={teamId} apps={isFetching ? undefined : apps} setAppState={setAppState} loading={isLoading} />
    </MainLayout>
  )
}
