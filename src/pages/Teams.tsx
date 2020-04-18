import React from 'react'
import { Loader, Teams, Error } from '../components'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/Main'

export default (): any => {
  const [teams, loading, error]: any = useApi('getTeams')

  return (
    <MainLayout>
      {loading && <Loader />}
      {!loading && teams && <Teams teams={teams} />}
      {error && <Error code={404} />}
    </MainLayout>
  )
}
