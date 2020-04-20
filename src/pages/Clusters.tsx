import React from 'react'
import Clusters from '../components/Clusters'
import Loader from '../components/Loader'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

export default (): any => {
  const [clusters, loading]: any = useApi('getClusters')

  return (
    <PaperLayout>
      {loading && <Loader />}
      {clusters && <Clusters clusters={clusters} />}
    </PaperLayout>
  )
}
