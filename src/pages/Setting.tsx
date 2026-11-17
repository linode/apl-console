import Setting from 'components/Setting'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'

interface Params {
  settingId?: string
}

export default function ({
  match: {
    params: { settingId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { refetchSettings } = useSession()
  const [edit, { isLoading: isLoadingUpdate }] = useEditSettingsMutation()
  const { data, isLoading, isFetching, refetch } = useGetSettingsQuery({ ids: [settingId, 'obj'] })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== undefined && !isDirty && !isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingUpdate
  const handleSubmit = async (formData: Record<string, unknown>) => {
    const result = await edit({ settingId, body: { [settingId]: formData } })
    if ('error' in result) return false
    refetch()
    refetchSettings()
    return true
  }
  const settings = data?.[settingId] || {}
  const objSettings = data?.obj || {}
  const comp = (
    <Setting
      key={settingId}
      onSubmit={handleSubmit}
      settings={settings}
      settingId={settingId}
      mutating={mutating}
      objSettings={objSettings}
    />
  )
  return <PaperLayout comp={comp} loading={isLoading} title={t('TITLE_SETTINGS', { settingId })} />
}
