import React from 'react'
import Loader from '../components/Loader'
import Services from '../components/Services/Services'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { getIsAdmin } from '../session-context'

export default ({
  match: {
    params: { teamName },
  },
}): any => {
  const isAdmin = getIsAdmin()
  const [services, loading, error] = useApi('getAllServices', teamName)

  if (loading) {
    return <Loader />
  }
  if (error) {
    return null
  }
  return (
    <MainLayout>
      <Services services={services} isAdmin={isAdmin} />
    </MainLayout>
  )
}
