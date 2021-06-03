import React from 'react'
import Clusters from '../components/Clusters'
import PaperLayout from '../layouts/Paper'

export default (): React.ReactElement => {
  const comp = <Clusters />
  return <PaperLayout comp={comp} />
}
