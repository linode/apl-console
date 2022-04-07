import Clusters from 'components/Clusters'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React from 'react'

export default function (): React.ReactElement {
  const {
    settings: {
      cluster,
      otomi: { additionalClusters = [] },
    },
  } = useSession()
  // END HOOKS
  const allClusters = [...additionalClusters, cluster]
  return <PaperLayout title='Clusters' comp={<Clusters clusters={allClusters} />} />
}
