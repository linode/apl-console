import React from 'react'
import Clusters from '../components/Clusters'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

export default (): React.ReactElement => {
  const [settings, settingsLoading, settingsError]: any = useApi('getSettings')
  const comp = !(settingsError || settingsLoading) && <Clusters settings={settings} />
  return <PaperLayout err={settingsError} loading={settingsLoading} comp={comp} />
}
