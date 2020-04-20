import React from 'react'
import { Loader, Teams, Error } from '../components'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

export default (): any => {
  const [teams, loading, error]: any = useApi('getTeams')

  return (
    <PaperLayout>
      {loading && <Loader />}
      {!loading && teams && <Teams teams={teams} />}
      {error && <Error code={404} />}
    </PaperLayout>
  )
}
