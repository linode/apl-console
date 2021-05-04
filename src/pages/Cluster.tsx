import React from 'react'
import PaperLayout from '../layouts/Paper'
import Cluster from '../components/Cluster'

export default (): React.ReactElement => {
  const err = undefined
  const loading = undefined
  const comp = !(err || loading) && <Cluster />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
