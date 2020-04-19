import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Services from '../components/Services'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/Main'
import { useSession } from '../session-context'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): any => {
  const {
    oboTeamId,
    user: { isAdmin, teamId: userTeamId },
  } = useSession()
  const sessTeamId = isAdmin ? oboTeamId : userTeamId
  const [services, loading, error]: any = useApi('getTeamServices', teamId)
  const [team, teamLoading, teamError]: any = useApi('getTeam', teamId)

  return (
    <MainLayout>
      {(loading || teamLoading) && <Loader />}
      {services && <Services services={services} sessTeamId={sessTeamId} team={team} isAdmin={isAdmin} />}
      {(error || teamError) && <Error code={404} />}
    </MainLayout>
  )
}
