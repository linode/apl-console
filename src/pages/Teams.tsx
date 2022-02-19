import React from 'react'
import Teams from 'components/Teams'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'

export default (): React.ReactElement => {
  const [teams, loading, err]: any = useApi('getTeams')
  const comp = !(err || loading) && <Teams teams={teams} />
  return <PaperLayout loading={loading} comp={comp} />
}
