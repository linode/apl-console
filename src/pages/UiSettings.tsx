import React from 'react'
import UiSettings from '../components/UiSettings'
import PaperLayout from '../layouts/Paper'

export default (): React.ReactElement => {
  return <PaperLayout comp={<UiSettings />} />
}
