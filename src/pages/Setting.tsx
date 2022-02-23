import Setting from 'components/Setting'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { renameKeys } from 'utils/data'

interface Params {
  settingId?: string
}

export default function ({
  match: {
    params: { settingId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [formData, setFormdata] = useState()

  useEffect(() => {
    setFormdata(undefined)
  }, [settingId])

  const [settings, settingsLoading, settingsError]: any = useApi('getAllSettings', settingId)

  const [, editLoading, editError] = useApi('editSetting', !!formData, [
    settingId,
    { [settingId]: renameKeys(formData) },
  ])

  const loading = settingsLoading || editLoading
  const err = settingsError || editError
  let formSettings = settings
  if (formData) formSettings = { ...formSettings, [settingId]: formData }
  const comp = !loading && (!err || formData || settings) && (
    <Setting onSubmit={setFormdata} settings={formSettings} settingId={settingId} />
  )
  return <PaperLayout comp={comp} loading={loading} />
}
