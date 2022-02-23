import Clusters from 'components/Clusters'
import PaperLayout from 'layouts/Paper'
import React from 'react'

export default function (): React.ReactElement {
  const comp = <Clusters />
  return <PaperLayout comp={comp} />
}
