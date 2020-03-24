import React from 'react'
import Loader from '../components/Loader'
import Services from '../components/Services'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'

export default ({
  match: {
    params: { teamId },
  },
}): any => {
  const method = teamId ? 'getTeamServices' : 'getAllServices'
  const [services, loading, error] = useApi(method, teamId)

  return (
    <MainLayout>
      {loading && <Loader />}
      {services && <Services services={services} />}
    </MainLayout>
  )
}
