import { getSpec } from 'common/api-spec'
import Setting from 'components/Setting'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'
import { cleanReadOnly } from 'utils/schema'

interface Params {
  settingId?: string
}

export default function ({
  match: {
    params: { settingId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { refetchSettings } = useSession()
  const [edit] = useEditSettingsMutation()
  const { data, isLoading, refetch } = useGetSettingsQuery({ ids: [settingId] })
  const { t } = useTranslation()
  // END HOOKS
  const handleSubmit = (formData) => {
    const schema = getSpec().components.schemas.Settings
    const cleanData = cleanReadOnly(schema.properties[settingId], formData)
    edit({ body: { [settingId]: cleanData } })
      .then(refetch)
      .then(refetchSettings)
  }
  const settings = data?.[settingId]
  const comp = settings && <Setting onSubmit={handleSubmit} settings={settings} settingId={settingId} />
  return <PaperLayout comp={comp} loading={isLoading} title={t('TITLE_SETTINGS', { settingId })} />
}
