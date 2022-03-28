import Loader from 'components/Loader'
import Setting from 'components/Setting'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'

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
  const [edit, { isSuccess: okEdit, isLoading: isLoadingEdit }] = useEditSettingsMutation()
  const { data, isLoading, error, refetch } = useGetSettingsQuery({ ids: [settingId] })
  useEffect(() => {
    setFormData(undefined)
  }, [settingId])
  useEffect(() => {
    if (formData) {
      setFormData(undefined)
      edit({ body: { [settingId]: formData as any } })
    }
    if (okEdit) {
      refetch()
      // we wish to refetch settings kept in the session for the UI state, but only if we have edited one of them
      // IMPORTANT: we have to use setTimeout to avoid concurrent state update
      if (Object.keys(sessSettings).includes(settingId)) setTimeout(refetchSettings)
    }
  }, [formData, okEdit])
  // END HOOKS
  let settings = data
  if (formData) settings = { ...settings, [settingId]: formData }
  const comp =
    isLoading || isLoadingEdit || error ? (
      <Loader />
    ) : (
      <Setting onSubmit={setFormData} settings={settings} settingId={settingId} />
    )
  return <PaperLayout comp={comp} loading={isLoading} />
}
