import React from 'react'
import PaperLayout from '../layouts/Paper'
import Settings from '../components/Settings'

const doNothing = () => {
  const something = 'nothing'
}

export default (): React.ReactElement => {
  const comp = <Settings onSubmit={doNothing} />
  return <PaperLayout comp={comp} />
}
