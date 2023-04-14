/* eslint-disable @typescript-eslint/no-floating-promises */
import Apps from 'components/Apps'
import useAuthzSession from 'hooks/useAuthzSession'
import MainLayout from 'layouts/Empty'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAppsQuery, useGetTeamQuery, useToggleAppsMutation } from 'redux/otomiApi'

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
  const [toggle, { isSuccess: okToggle }] = useToggleAppsMutation()
  const { data: apps, isLoading, isFetching, refetch } = useGetAppsQuery({ teamId })
  const { data: teamSettings } = useGetTeamQuery({ teamId })
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
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  // END HOOKS
  return (
    <MainLayout title={`Apps - ${teamId === 'admin' ? 'admin' : 'team'}`}>
      <Apps
        teamId={teamId}
        apps={isFetching ? undefined : apps}
        teamSettings={teamSettings}
        setAppState={setAppState}
        loading={isLoading}
      />
    </MainLayout>
  )
}
