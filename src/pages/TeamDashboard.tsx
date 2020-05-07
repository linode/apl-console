import React from 'react'
import { Loader } from '../components'
import Dashboard from '../components/Dashboard'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'

export default (): any => {
  const {
    user: { isAdmin, teamId },
    clusters,
  } = useSession()

  const servicesApi = isAdmin ? 'getAllServices' : 'getTeamServices'
  const [services, servicesLoading, servicesError]: any = useApi(servicesApi, isAdmin ? undefined : teamId)
  const [teams, teamsLoading, teamsError]: any = useApi('getTeams')
  const [team, teamLoading, teamError]: any = useApi('getTeam', teamId)

  const error = servicesError || teamsError || teamError
  const loading = servicesLoading || teamsLoading || teamLoading
  const data = {
    services,
    teams,
    clusters,
  }

  return (
    <PaperLayout>
      <>
        {(loading || teamLoading) && <Loader />}
        {data && <Dashboard data={data} team={team} />}
        {error && teamError && <Error code={404} />}
      </>
    </PaperLayout>
  )
}
