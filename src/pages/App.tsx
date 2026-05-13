import App from 'components/App'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useEditAppMutation, useGetTeamAppQuery } from 'redux/otomiApi'

interface Params {
  teamId: string
  appId: string
}

export default function ({
  match: {
    params: { teamId, appId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [edit, { isLoading: isLoadingUpdate }] = useEditAppMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetTeamAppQuery(
    { teamId, appId },
    { skip: teamId !== 'admin' },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  const mutating = isLoadingUpdate
  const handleSubmit = (formData) => edit({ teamId, appId, body: formData }).then(refetch)
  const comp = !isError && <App onSubmit={handleSubmit} id={appId} {...data} teamId={teamId} mutating={mutating} />

  return <PaperLayout comp={comp} loading={isLoading} />
}
