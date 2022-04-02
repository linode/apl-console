import Policies from 'components/Policies'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetSettingsQuery } from 'redux/otomiApi'
import { k } from 'translations/keys'

export default function (): React.ReactElement {
  const { data, isLoading, error } = useGetSettingsQuery({ ids: ['policies'] })
  const { t } = useTranslation()
  const comp = !(isLoading || error) && data?.policies && <Policies policies={data?.policies} />
  return <PaperLayout comp={comp} loading={isLoading} title={t(k.TITLE_POLICIES)} />
}
