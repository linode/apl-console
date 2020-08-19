import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Secrets from '../components/Secrets'
import { useApi, useAuthz } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>) => {
  const { tid } = useAuthz(teamId)
  const secretsMethod = !teamId ? 'getAllSecrets' : 'getSecrets'
  const [secrets, secretsLoading, secretsError]: any = useApi(secretsMethod, true, [tid])
  const [team, teamLoading, teamError]: any = useApi('getTeam', !!teamId, [teamId])
  const loading = secretsLoading || teamLoading
  const err = secretsError || teamError
  const comp = !(err || loading) && <Secrets team={team} secrets={secrets} />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
