import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import PaperLayout from '../layouts/Paper'
import Cluster from '../components/Cluster'

interface Params {
  clusterId: string
}

export default ({
  match: {
    params: { clusterId },
  },
}: RouteComponentProps<Params>): any => {
  return (
    <PaperLayout>
      <Cluster clusterId={decodeURIComponent(clusterId)} />
    </PaperLayout>
  )
}
