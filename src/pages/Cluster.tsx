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
}: RouteComponentProps<Params>): React.ReactElement => {
  const loading = undefined
  const comp = !loading && <Cluster clusterId={decodeURIComponent(clusterId)} />
  return <PaperLayout loading={loading} comp={comp} />
}
