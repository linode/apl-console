/* eslint-disable @typescript-eslint/no-floating-promises */
import App from 'components/App'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useEditAppMutation, useGetTeamAppQuery, useToggleAppsMutation } from 'redux/otomiApi'

interface Params {
  teamId: string
  appId: string
}

export default function ({
  match: {
    params: { teamId, appId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { refetchAppsEnabled } = useAuthzSession(teamId)
  const [edit, { isLoading: isLoadingUpdate }] = useEditAppMutation()
  const [toggle, { isLoading: isLoadingToggle }] = useToggleAppsMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetTeamAppQuery(
    { teamId, appId },
    { skip: teamId !== 'admin' },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  // END HOOKS
  const mutating = isLoadingUpdate || isLoadingToggle
  const handleSubmit = (formData) => edit({ teamId, appId, body: formData }).then(refetch)
  const handleAppState = (appState) => {
    const [appIds, appEnabled] = appState
    toggle({ teamId, body: { ids: appIds, enabled: appEnabled } })
      .then(refetch)
      .then(refetchAppsEnabled)
  }
  const comp = !isError && (
    <App
      onSubmit={handleSubmit}
      id={appId}
      {...data}
      teamId={teamId}
      setAppState={handleAppState}
      mutating={mutating}
    />
  )
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={isLoading} />
}
