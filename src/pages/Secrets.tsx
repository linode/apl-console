import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Secrets from '../components/Secrets'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
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
  const [secrets, loading, error]: any = useApi('getSecrets', { teamId })
  const [team, teamLoading, teamError]: any = useApi('getTeam', sessTeamId)
  return (
    <PaperLayout>
      {(loading || teamLoading) && <Loader />}
      {secrets && team && <Secrets secrets={secrets} team={team} />}
      {(error || teamError) && <Error code={404} />}
    </PaperLayout>
  )
}
