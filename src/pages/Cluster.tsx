import React from 'react'
import Cluster from 'components/Cluster'
import PaperLayout from 'layouts/Paper'

export default function (): React.ReactElement {
  const loading = undefined
  const comp = !loading && <Cluster />
  return <PaperLayout loading={loading} comp={comp} />
}
