import Setting from 'components/Setting'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useEditSettingsMutation, useGetSettingsQuery } from 'store/otomi'

interface Params {
  settingId?: string
}

export default function ({
  match: {
    params: { settingId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [formData, setFormData] = useState()
  const { settings: sessSettings, refetchSettings } = useSession()
  useEffect(() => {
    setFormData(undefined)
  }, [settingId])
  const { data, isLoading, error, refetch } = useGetSettingsQuery({ ids: [settingId] })
  const [edit, { isSuccess: editOk }] = useEditSettingsMutation()
  // END HOOKS
  if (formData) {
    edit({ body: { [settingId]: formData as any } })
    setFormData(undefined)
  }
  if (editOk) {
    refetch()
    // we wish to refetch settings kept in the session for the UI state, but only if we have edited one of them
    if (Object.keys(sessSettings).includes(settingId)) setTimeout(refetchSettings)
  }

  let settings = data
  if (formData) settings = { ...settings, [settingId]: formData }
  const comp = !(isLoading || error) && settings && (
    <Setting onSubmit={setFormData} settings={settings} settingId={settingId} />
  )
  return <PaperLayout comp={comp} loading={isLoading} />
}
