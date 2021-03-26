import React from 'react'
import { Teams } from '../components'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

export default (): React.ReactElement => {
  const [teams, loading, err]: any = useApi('getTeams')
  const comp = !(err || loading) && <Teams teams={teams} />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
