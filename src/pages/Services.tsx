import { Service, Team } from '@redkubes/otomi-api-client-axios'
import Services from 'components/Services'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { ErrorApi } from 'utils/error'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const servicesMethod = teamId ? 'getTeamServices' : 'getAllServices'
  const servicesArgs = teamId ? [teamId] : []
  const [services, servicesLoading, servicesError]: [Array<Service>, boolean, ErrorApi] = useApi(
    servicesMethod,
    true,
    servicesArgs,
  )
  const [team, teamLoading, teamError]: [Team, boolean, ErrorApi] = useApi('getTeam', !!teamId, [teamId])
  const loading = servicesLoading || teamLoading
  const err = servicesError || teamError
  const comp = !(err || loading) && <Services services={services} team={team} />
  return <PaperLayout loading={loading} comp={comp} />
}
