import React from 'react'
import { Loader } from '../components'
import Dashboard from '../components/Dashboard'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'

interface Props {
  data: any
  loading: boolean
  error: any
  teamId?: string
}

const TeamDashboard = ({ data, loading, error, teamId }: Props) => {
  const [team, teamLoading, teamError]: any = useApi('getTeam', teamId)
  return (
    <>
      {(loading || teamLoading) && <Loader />}
      {data && <Dashboard data={data} team={team} />}
      {(error || teamError) && <Error code={404} />}
    </>
  )
}

export default (): any => {
  const {
    user: { isAdmin, teamId },
    clusters,
  } = useSession()

  const servicesApi = isAdmin ? 'getAllServices' : 'getTeamServices'
  const [services, servicesLoading, servicesError]: any = useApi(servicesApi, isAdmin ? undefined : teamId)
  const [teams, teamsLoading, teamsError]: any = useApi('getTeams')

  const error = servicesError || teamsError
  const loading = servicesLoading || teamsLoading
  const data = {
    services,
    teams,
    clusters,
  }

  return (
    <PaperLayout>
      {isAdmin ? (
        <>
          {loading && <Loader />}
          {data && <Dashboard data={data} isAdmin />}
          {error && <Error code={404} />}
        </>
      ) : (
        <TeamDashboard data={data} loading={loading} error={error} teamId={teamId} />
      )}
    </PaperLayout>
  )
}
