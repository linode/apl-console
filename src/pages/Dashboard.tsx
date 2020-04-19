import React from 'react'
import { Loader } from '../components'
import Dashboard from '../components/Dashboard'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/Main'
import { useSession } from '../session-context'

interface Props {
  teamId: string
}

const TeamDashboard = ({ teamId }: Props): any => {
  const [team, loading, error]: any = useApi('getTeam', teamId)
  return (
    <>
      {loading && <Loader />}
      {team && <Dashboard team={team} />}
      {error && <Error code={404} />}
    </>
  )
}

export default (): any => {
  const {
    user: { isAdmin, teamId },
  } = useSession()

  return <MainLayout>{isAdmin ? <Dashboard /> : <TeamDashboard teamId={teamId} />}</MainLayout>
}
