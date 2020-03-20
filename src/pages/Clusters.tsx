import React from 'react'
import Clusters from '../components/Clusters'
import Loader from '../components/Loader'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'

export default (): any => {
  const [clusters, loading, error] = useApi('getClusters')

  if (loading) {
    return <Loader />
  }
  if (error) {
    return null
  }
  return (
    <MainLayout>
      <Clusters clusters={clusters} />
    </MainLayout>
  )
}
