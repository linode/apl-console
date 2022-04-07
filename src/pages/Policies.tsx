import Policies from 'components/Policies'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetSettingsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const { data, isLoading } = useGetSettingsQuery({ ids: ['policies'] })
  const { t } = useTranslation()
  const comp = data && <Policies policies={data?.policies} />
  return <PaperLayout comp={comp} loading={isLoading} title={t('TITLE_POLICIES')} />
}
