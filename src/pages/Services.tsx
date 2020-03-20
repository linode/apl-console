import React from 'react'
import Loader from '../components/Loader'
import Services from '../components/Services'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'

export default ({
  match: {
    params: { teamName },
  },
}): any => {
  const method = teamName ? 'getTeamServices' : 'getAllServices'
  const [services, loading, error] = useApi(method, teamName)

  if (loading) {
    return <Loader />
  }
  if (error) {
    return null
  }
  return (
    <MainLayout>
      <Services services={services} />
    </MainLayout>
  )
}
