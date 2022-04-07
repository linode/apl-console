import Teams from 'components/Teams'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetTeamsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const { data, isLoading, error } = useGetTeamsQuery()
  const { t } = useTranslation()
  // END HOOKS
  const comp = data && <Teams teams={data} />
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_TEAMS')} />
}
