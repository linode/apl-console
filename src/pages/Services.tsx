import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Services from '../components/Services'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>) => {
  const servicesMethod = teamId ? 'getTeamServices' : 'getAllServices'
  const servicesArgs = teamId ? [teamId] : []
  const [services, servicesLoading, servicesError]: any = useApi(servicesMethod, true, servicesArgs)
  const [team, teamLoading, teamError]: any = useApi('getTeam', !!teamId, [teamId])
  const loading = servicesLoading || teamLoading
  const err = servicesError || teamError
  const comp = !(err || loading) && <Services services={services} team={team} />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
