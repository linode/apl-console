import Teams from 'components/Teams'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetMetricsQuery, useGetTeamsQuery } from 'redux/otomiApi'
import { canCreateAdditionalResource } from 'utils/permission'

export default function (): React.ReactElement {
  const { data, isLoading: isLoadingTeams, isFetching, refetch } = useGetTeamsQuery()
  const { data: metrics, isLoading: isLoadingMetrics } = useGetMetricsQuery()
  const { license } = useSession()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false && !isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const comp = data && <Teams teams={data} canCreateResource={canCreateAdditionalResource('team', metrics, license)} />
  return <PaperLayout loading={isLoadingTeams || isLoadingMetrics} comp={comp} title={t('TITLE_TEAMS')} />
}
