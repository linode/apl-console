import Teams from 'components/Teams'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetTeamsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const { data, isLoading: isLoadingTeams, isFetching, refetch } = useGetTeamsQuery()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false && !isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const comp = data && <Teams teams={data} />
  return <PaperLayout loading={isLoadingTeams} comp={comp} title={t('TITLE_TEAMS')} />
}
