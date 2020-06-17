/* eslint-disable no-prototype-builtins */
import find from 'lodash/find'
import React from 'react'
import { Loader } from '../components'
import Dashboard from '../components/Dashboard'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import { Team } from '../models'

export default (): any => {
  const {
    oboTeamId,
    user: { isAdmin, teamId },
    clusters,
  } = useSession()
  const [services, servicesLoading, servicesError]: any = useApi(
    isAdmin ? 'getAllServices' : 'getTeamServices',
    true,
    isAdmin ? undefined : teamId,
  )
  const [teams, teamsLoading, teamsError]: any = useApi('getTeams')

  const error = servicesError || teamsError
  const loading = servicesLoading || teamsLoading
  const data = {
    services,
    teams,
    clusters,
  }
  const team: Team = find(data.teams, { id: isAdmin ? oboTeamId : teamId })
  return (
    <PaperLayout>
      {loading && <Loader />}
      {!loading && data && <Dashboard data={data} isAdmin={isAdmin} team={team} />}
      {error && <Error code={404} />}
    </PaperLayout>
  )
}
