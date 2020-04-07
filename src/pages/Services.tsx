import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Services from '../components/Services'
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
  const [services, loading]: any = useApi(method, teamId)
  const { isAdmin, teamId: sessTeamId } = useSession()

  return (
    <MainLayout>
      {loading && <Loader />}
      {services && <Services services={services} sessTeamId={sessTeamId} teamId={teamId} isAdmin={isAdmin} />}
    </MainLayout>
  )
}
