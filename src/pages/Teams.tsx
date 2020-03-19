import React from 'react'
import Loader from '../components/Loader'
import Teams from '../components/Teams/Teams'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'

export default (): any => {
  useSession()
  const [teams, teamsLoading, teamsError] = useApi('getTeamCollection')

  if (teamsLoading) {
    return <Loader />
  }
  if (teamsError) {
    return
  }
  return (
    <MainLayout>
      <Teams teams={teams} />
    </MainLayout>
  )
}
