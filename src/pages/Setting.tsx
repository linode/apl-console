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
  const { data, isLoading, isFetching, refetch } = useGetSettingsQuery({ ids: [settingId] })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== undefined && !isDirty && !isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingUpdate
  const handleSubmit = (formData) => {
    edit({ settingId, body: { [settingId]: formData } })
      .then(refetch)
      .then(refetchSettings)
  }
  const settings = data?.[settingId] || {}
  const comp = <Setting onSubmit={handleSubmit} settings={settings} settingId={settingId} mutating={mutating} />
  return <PaperLayout comp={comp} loading={isLoading} title={t('TITLE_SETTINGS', { settingId })} />
}
