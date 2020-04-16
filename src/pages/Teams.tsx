import React from 'react'
import Loader from '../components/Loader'
import Teams from '../components/Teams'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'

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
