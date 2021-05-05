import React, { useState } from 'react'
import PaperLayout from '../layouts/Paper'
import Settings from '../components/Settings'

export default (): React.ReactElement => {
  return <PaperLayout comp={<Settings someProp={1} />} />
}
