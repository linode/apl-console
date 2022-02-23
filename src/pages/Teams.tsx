import Teams from 'components/Teams'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import React from 'react'

export default function (): React.ReactElement {
  const [teams, loading, err]: any = useApi('getTeams')
  const comp = !(err || loading) && <Teams teams={teams} />
  return <PaperLayout loading={loading} comp={comp} />
}
