import { skipToken } from '@reduxjs/toolkit/dist/query'
import Jobs from 'components/Jobs'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllJobsQuery, useGetTeamJobsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    data: allJobs,
    isLoading: isLoadingAllJobs,
    isFetching: isFetchingAllJobs,
    refetch: refetchAllJobs,
  } = useGetAllJobsQuery(teamId ? skipToken : undefined)
  const {
    data: teamJobs,
    isLoading: isLoadingTeamJobs,
    isFetching: isFetchingTeamJobs,
    refetch: refetchTeamJobs,
  } = useGetTeamJobsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllJobs) refetchAllJobs()
    else if (teamId && !isFetchingTeamJobs) refetchTeamJobs()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllJobs || isLoadingTeamJobs
  const jobs = teamId ? teamJobs : allJobs
  const comp = jobs && <Jobs jobs={jobs} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_JOBS', { role: getRole(teamId) })} />
}
