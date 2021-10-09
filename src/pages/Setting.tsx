import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import PaperLayout from '../layouts/Paper'
import Setting from '../components/Setting'
import { useApi } from '../hooks/api'

interface Params {
  settingId?: string
}

// TODO: https://github.com/redkubes/otomi-api/issues/183
function renameKeys(data) {
  if (data === undefined) return data
  const keyValues = Object.keys(data).map((key) => {
    const newKey = key.replaceAll('-', '_')
    return { [newKey]: data[key] }
  })
  return Object.assign({}, ...keyValues)
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

  const [settings, settingsLoading, settingsError]: any = useApi('getAllSettings', settingId)

  const [, editLoading, editError] = useApi('editSetting', !!formdata, [
    settingId,
    { [settingId]: renameKeys(formdata) },
  ])

  const loading = settingsLoading || editLoading
  const err = settingsError || editError

  const comp = !loading && (!err || formdata || settings) && (
    <Setting onSubmit={setFormdata} settings={formdata || settings} settingId={settingId} />
  )
  return <PaperLayout comp={comp} loading={loading} />
}
