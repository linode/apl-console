import React, { useState } from 'react'
import PaperLayout from '../layouts/Paper'
import Settings from '../components/Settings'

export default (): React.ReactElement => {
  const [formdata, setFormdata] = useState()
  const comp = <Settings onSubmit={setFormdata} settings={formdata} />
  return <PaperLayout comp={comp} />
}
