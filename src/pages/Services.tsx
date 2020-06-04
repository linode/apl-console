import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Services from '../components/Services'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'

interface TeamServiceProps {
  services: any
  loading: boolean
  error: any
  teamId: string
}

const TeamServices = ({ services, loading, error, teamId }: TeamServiceProps) => {
  const [team, teamLoading, teamError]: any = useApi('getTeam', teamId)
  return (
    <>
      {(loading || teamLoading) && <Loader />}
      {services && team && <Services services={services} team={team} />}
      {(error || teamError) && <Error code={404} />}
    </>
  )
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
  const [services, loading, error]: any = useApi(servicesApi, teamId)
  return (
    <PaperLayout>
      {!teamId ? (
        <>
          {loading && <Loader />}
          {services && <Services services={services} />}
          {error && <Error code={404} />}
        </>
      ) : (
        <TeamServices services={services} loading={loading} error={error} teamId={teamId} />
      )}
    </PaperLayout>
  )
}
