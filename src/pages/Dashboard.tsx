import React from 'react'
import Dashboard from '../components/Dashboard'
import MainLayout from '../layouts/Main'
import { useSession } from '../session-context'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import { Loader } from '../components'

export default (): any => {
  const {
    user: { isAdmin, teamId },
  } = useSession()
  const [team, loading, error]: any = useApi('getTeam', teamId)

  return (
    <MainLayout>
      {loading && <Loader />}
      {team && <Dashboard team={team} />}
      {error && <Error code={404} />}
    </MainLayout>
  )
}
