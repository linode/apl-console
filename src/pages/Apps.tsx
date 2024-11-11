/* eslint-disable @typescript-eslint/no-floating-promises */
import Apps from 'components/Apps'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAppsQuery, useGetSettingsQuery, useGetTeamQuery, useToggleAppsMutation } from 'redux/otomiApi'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    refetchAppsEnabled,
    user: { isPlatformAdmin },
  } = useAuthzSession(teamId)
  const [appState, setAppState] = useState([])
  const [appIds, appEnabled] = appState
  const [toggle, { isSuccess: okToggle }] = useToggleAppsMutation()
  const { data: apps, isLoading, isFetching, refetch } = useGetAppsQuery({ teamId })
  const { data: teamSettings } = useGetTeamQuery({ teamId })
  const {
    data: objSettings,
    isLoading: isLoadingSettings,
    isFetching: isFetchingSettings,
    refetch: refetchSettings,
  } = useGetSettingsQuery({ ids: ['obj'] }, { skip: !isPlatformAdmin })
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
    if (!isFetchingSettings) refetchSettings()
  }, [isDirty])
  // END HOOKS
  const loading = isLoading || isLoadingSettings
  const comp = apps && (
    <Apps
      teamId={teamId}
      apps={isFetching ? undefined : apps}
      teamSettings={teamSettings}
      setAppState={setAppState}
      objSettings={objSettings}
    />
  )
  return <PaperLayout loading={loading} comp={comp} title={`Apps - ${teamId === 'admin' ? 'admin' : 'team'}`} />
}
