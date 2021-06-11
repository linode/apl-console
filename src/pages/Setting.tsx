import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import PaperLayout from '../layouts/Paper'
import Setting from '../components/Setting'
import { getSettingsSchema } from '../api-spec'
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
  const [setting, settingLoading, settingError]: any = useApi('getSubSetting', !!settingId, [settingId])
  const [createRes, createLoading, createError] = useApi('editSubSetting', !!formdata, [settingId, formdata])
  const loading = settingLoading || createLoading
  const err = settingError || createError
  const comp = !loading && (!err || formdata || setting) && (
    <Setting
      onSubmit={setFormdata}
      setting={setting[settingId]}
      settingId={settingId}
      schema={getSettingsSchema().properties[settingId]}
    />
  )
  return <PaperLayout comp={comp} />
}
