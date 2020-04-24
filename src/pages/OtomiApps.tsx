import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Apps from '../components/Apps'
import Error from '../components/Error'
import MainLayout from '../layouts/Empty'
import { useSession } from '../session-context'

interface Params {
  teamId: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): any => {
  const {
    user: { isAdmin },
  } = useSession()
  if (teamId === 'admin' && !isAdmin) return <Error code={401} />
  return (
    <MainLayout>
      <Apps teamId={teamId} />
    </MainLayout>
  )
}
