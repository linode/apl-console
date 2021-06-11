import React from 'react'
import FormUi from '../components/SettingsUi'
import PaperLayout from '../layouts/Paper'

export default (): React.ReactElement => {
  return <PaperLayout comp={<FormUi />} />
}
