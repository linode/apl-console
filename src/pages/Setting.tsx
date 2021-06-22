import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import PaperLayout from '../layouts/Paper'
import Setting from '../components/Setting'
import { useApi } from '../hooks/api'

interface Params {
  settingId?: string
}

export default ({
  match: {
    params: { settingId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const [formdata, setFormdata] = useState()

  useEffect(() => {
    setFormdata(undefined)
  }, [settingId])

  const [setting, settingLoading, settingError]: any = useApi('getSetting', !!settingId, [settingId])
  const [, editLoading, editError] = useApi('editSetting', !!formdata, [settingId, { [settingId]: formdata }])
  const loading = settingLoading || editLoading
  const err = settingError || editError
  const comp = !loading && (!err || formdata || setting) && (
    <Setting onSubmit={setFormdata} setting={setting[settingId]} settingId={settingId} />
  )
  return <PaperLayout comp={comp} loading={loading} />
}
