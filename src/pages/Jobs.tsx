import { skipToken } from '@reduxjs/toolkit/dist/query'
import Jobs from 'components/Jobs'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGetAllJobsQuery, useGetTeamJobsQuery } from 'store/otomi'

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
    error: errorAllJobs,
  } = useGetAllJobsQuery(teamId ? skipToken : undefined)
  const {
    data: teamJobs,
    isLoading: isLoadingTeamJobs,
    error: errorTeamJobs,
  } = useGetTeamJobsQuery({ teamId }, { skip: !teamId })
  // END HOOKS
  const loading = isLoadingAllJobs || isLoadingTeamJobs
  const err = errorAllJobs || errorTeamJobs
  const jobs = teamId ? teamJobs : allJobs
  const comp = !(err || loading) && jobs && <Jobs jobs={jobs} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} />
}
