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
      {data && <Dashboard summary={data} team={team} />}
      {error && teamError && <Error code={404} />}
    </>
  )
}

const AdminDashboard = ({ data, loading, error }: Props) => {
  return (
    <>
      {loading && <Loader />}
      {data && <Dashboard summary={data} />}
      {error && <Error code={404} />}
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
  const summary = {
    services,
    teams,
    clusters,
  }

  return (
    <PaperLayout>
      {isAdmin ? (
        <AdminDashboard data={summary} loading={loading} error={error} />
      ) : (
        <TeamDashboard data={summary} loading={loading} error={error} teamId={teamId} />
      )}
    </PaperLayout>
  )
}
