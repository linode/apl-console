import { Service, Team } from '@redkubes/otomi-api-client-axios'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Services from '../components/Services'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import { ApiError } from '../utils/error'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const { mode } = useSession()
  // eslint-disable-next-line no-nested-ternary
  const servicesMethod = teamId ? 'getTeamServices' : mode ? 'services' : 'getAllServices'
  const servicesArgs = teamId ? [teamId] : []
  const [services, servicesLoading, servicesError]: [Array<Service>, boolean, ApiError] = useApi(
    servicesMethod,
    true,
    servicesArgs,
  )
  const [team, teamLoading, teamError]: [Team, boolean, ApiError] = useApi('getTeam', !!teamId, [teamId])
  const loading = servicesLoading || teamLoading
  const err = servicesError || teamError
  const comp = !(err || loading) && <Services services={services} team={team} />
  return <PaperLayout loading={loading} comp={comp} />
}
