import { skipToken } from '@reduxjs/toolkit/query/react'
import Workloads from 'components/Workloads'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllWorkloadsQuery, useGetTeamWorkloadsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function WorkloadsOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    data: allWorkloads,
    isLoading: isLoadingAllWorkloads,
    isFetching: isFetchingAllWorkloads,
    refetch: refetchAllWorkloads,
  } = useGetAllWorkloadsQuery(teamId ? skipToken : undefined)
  const {
    data: teamWorkloads,
    isLoading: isLoadingTeamWorkloads,
    isFetching: isFetchingTeamWorkloads,
    refetch: refetchTeamWorkloads,
  } = useGetTeamWorkloadsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllWorkloads) refetchAllWorkloads()
    else if (teamId && !isFetchingTeamWorkloads) refetchTeamWorkloads()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllWorkloads || isLoadingTeamWorkloads
  const workloads = teamId ? teamWorkloads : allWorkloads
  const comp = workloads && <Workloads workloads={workloads} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_WORKLOADS', { scope: getRole(teamId) })} />
}
