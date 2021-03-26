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
  const err = undefined
  const loading = undefined
  const comp = !(err || loading) && <Cluster clusterId={decodeURIComponent(clusterId)} />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
