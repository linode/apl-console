import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Services from '../components/Services'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

interface TeamServiceProps {
  services: any
  loading: boolean
  error: any
  teamId: string
}

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): any => {
  const servicesApi = teamId ? 'getTeamServices' : 'getAllServices'
  const [services, loading, error]: any = useApi(servicesApi, true, teamId)
  const [team, teamLoading]: any = useApi('getTeam', !!teamId, teamId)
  return (
    <PaperLayout>
      <>
        {(loading || teamLoading) && <Loader />}
        {services && <Services services={services} team={team} />}
        {error && <Error code={404} />}
      </>
    </PaperLayout>
  )
}
