import React from 'react'
import Loader from '../components/Loader'
import Teams from '../components/Teams'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'

export default (): any => {
  const [teams, loading]: any = useApi('getTeams')

  return (
    <MainLayout>
      {loading && <Loader />}
      {teams && <Teams teams={teams} />}
    </MainLayout>
  )
}
