import React from 'react'
import PaperLayout from '../layouts/Paper'
import Cluster from '../components/Cluster'

export default (): React.ReactElement => {
  const loading = undefined
  const comp = !loading && <Cluster />
  return <PaperLayout loading={loading} comp={comp} />
}
