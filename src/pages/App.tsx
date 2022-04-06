/* eslint-disable @typescript-eslint/no-floating-promises */
import App from 'components/App'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useEditAppMutation, useGetAppQuery, useToggleAppsMutation } from 'redux/otomiApi'

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
  const { data, isLoading, refetch } = useGetAppQuery({ teamId, appId })
  const [edit] = useEditAppMutation()
  const [toggle] = useToggleAppsMutation()
  // END HOOKS
  const handleSubmit = (formData) => edit({ teamId, appId, body: formData }).then(refetch)
  const handleAppState = (appState) => {
    const [appIds, appEnabled] = appState
    toggle({ teamId, body: { ids: appIds, enabled: appEnabled } }).then(refetchAppsEnabled)
  }
  const comp = <App onSubmit={handleSubmit} id={appId} {...data} teamId={teamId} setAppState={handleAppState} />
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={isLoading} />
}
