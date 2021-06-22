import React, { useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
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
  console.info(`useApi parameter: ${JSON.stringify({ [settingId]: formdata })}`)

  const [editRes, editLoading, editError] = useApi('editSetting', !!formdata, [
    'policies',
    { policies: { banned_image_tags: { enabled: true } } },
  ])

  const loading = settingLoading || editLoading
  const err = settingError || editError

  if (editRes && !(editLoading || editError)) {
    window.location.reload()
  }
  const comp = !loading && (!err || formdata || setting) && (
    <Setting onSubmit={setFormdata} setting={setting[settingId]} settingId={settingId} />
  )
  return <PaperLayout comp={comp} loading={loading} />
}
