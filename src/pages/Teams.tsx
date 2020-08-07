import React from 'react'
import { Teams } from '../components'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'

export default () => {
  const [teams, loading, err]: any = useApi('getTeams')
  const { setTeams } = useSession()
  const comp = !(err || loading) && <Teams teams={teams} />
  if (!(err || loading)) setTeams(teams)
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
