import React, { useState } from 'react'
import PaperLayout from '../layouts/Paper'
import Settings from '../components/Settings'

export default (): React.ReactElement => {
  const comp = <Settings someProp={1} />
  return <PaperLayout comp={comp} />
}
