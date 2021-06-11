import React from 'react'
import SettingsUi from '../components/SettingsUi'
import SettingsForm from '../components/SettingsForm'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

const endpoints = ['alerts', 'azure', 'customer', 'dns', 'kms', 'home', 'oidc', 'otomi', 'smtp']

export default (): React.ReactElement => {
  // const [setting, settingLoading, settingError] = useApi('getSubSetting')
  return <PaperLayout comp={<SettingsUi />} />
}
