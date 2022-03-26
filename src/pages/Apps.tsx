/* eslint-disable @typescript-eslint/no-floating-promises */
import Apps from 'components/Apps'
import useAuthzSession from 'hooks/useAuthzSession'
import MainLayout from 'layouts/Empty'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGetAppsQuery, useToggleAppsMutation } from 'store/otomi'

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
  const [toggle, { isLoading: toggleLoading }] = useToggleAppsMutation()
  // END HOOKS
  if (appIds) {
    toggle({ teamId, body: { ids: appIds, enabled: appEnabled } })
    setAppState([])
  }
  if (toggleLoading) {
    // we wish to refetch settings kept in the session for the UI state
    // IMPORTANT: we have to use setTimeout to avoid concurrent state update
    refetch()
    setTimeout(refetchAppsEnabled)
  }
  return (
    <MainLayout>
      <Apps teamId={teamId} apps={isFetching ? undefined : apps} setAppState={setAppState} loading={isLoading} />
    </MainLayout>
  )
}
