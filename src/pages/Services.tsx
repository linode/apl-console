import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Services from '../components/Services'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): any => {
  const method = teamId ? 'getTeamServices' : 'getAllServices'
  const [services, loading, error]: any = useApi(method, teamId)
  const { isAdmin, teamId: sessTeamId } = useSession()

  return (
    <MainLayout>
      {loading && <Loader />}
      {services && <Services services={services} sessTeamId={sessTeamId} teamId={teamId} isAdmin={isAdmin} />}
      {error && <Error code={404} />}
    </MainLayout>
  )
}
