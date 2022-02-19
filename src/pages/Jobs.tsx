import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Jobs from 'components/Jobs'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const jobsMethod = teamId ? 'getTeamJobs' : 'getAllJobs'
  const jobsArgs = teamId ? [teamId] : []
  const [jobs, jobsLoading, jobsError]: any = useApi(jobsMethod, true, jobsArgs)
  const [team, teamLoading, teamError]: any = useApi('getTeam', !!teamId, [teamId])
  const loading = jobsLoading || teamLoading
  const err = jobsError || teamError
  const comp = !(err || loading) && <Jobs jobs={jobs} team={team} />
  return <PaperLayout loading={loading} comp={comp} />
}
