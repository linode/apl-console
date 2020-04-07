import React from 'react'
import Clusters from '../components/Clusters'
import Loader from '../components/Loader'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'

export default (): any => {
  const [clusters, loading]: any = useApi('getClusters')

  return (
    <MainLayout>
      {loading && <Loader />}
      {clusters && <Clusters clusters={clusters} />}
    </MainLayout>
  )
}
