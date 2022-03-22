import { Settings } from '@redkubes/otomi-api-client-axios'
import Policies from 'components/Policies'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { ApiError } from 'utils/error'

export default function (): React.ReactElement {
  const [settings, settingsLoading, settingsError]: [Settings, boolean, ApiError] = useApi('getSettings', true, [
    ['policies'],
  ])

  const comp = !settingsLoading && (!settingsError || settings?.policies) && <Policies policies={settings?.policies} />
  return <PaperLayout comp={comp} loading={settingsLoading} />
}
