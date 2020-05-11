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
  sessTeamId?: string
  isAdmin: boolean
}

interface Params {
  teamId?: string
}

const TeamServices = ({ services, loading, error, sessTeamId, isAdmin }: TeamServiceProps) => {
  const [team, teamLoading, teamError]: any = useApi('getTeam', sessTeamId)
  return (
    <>
      {(loading || teamLoading) && <Loader />}
      {services && <Services services={services} sessTeamId={sessTeamId} team={team} isAdmin={isAdmin} />}
      {(error || teamError) && <Error code={404} />}
    </>
  )
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
  const servicesApi = teamId ? 'getTeamServices' : 'getAllServices'
  const [services, loading, error]: any = useApi(servicesApi, teamId)
  return (
    <PaperLayout>
      {isAdmin ? (
        <>
          {loading && <Loader />}
          {services && <Services services={services} sessTeamId={sessTeamId} isAdmin={isAdmin} />}
          {error && <Error code={404} />}
        </>
      ) : (
        <TeamServices services={services} loading={loading} error={error} sessTeamId={sessTeamId} isAdmin={isAdmin} />
      )}
    </PaperLayout>
  )
}
