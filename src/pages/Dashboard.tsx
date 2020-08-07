/* eslint-disable no-prototype-builtins */
import find from 'lodash/find'
import React from 'react'
import { Team } from '@redkubes/otomi-api-client-axios'
import Dashboard from '../components/Dashboard'
import { useApi, useAuthz } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

export default () => {
  const {
    sess: {
      user: { isAdmin },
      clusters,
      setTeams,
    },
    tid,
  } = useAuthz()
  const [services, servicesLoading, servicesError]: any = useApi(
    isAdmin ? 'getAllServices' : 'getTeamServices',
    true,
    isAdmin ? undefined : [tid],
  )
  const [teams, teamsLoading, teamsError]: any = useApi('getTeams')
  const team: Team = !(teamsLoading || teamsError) && find(teams, { id: tid })
  const err = servicesError || teamsError
  const loading = servicesLoading || teamsLoading
  if (!(err || loading)) setTeams(teams)
  const comp = !(err || loading) && (
    <Dashboard services={services} team={team} teams={teams} clusters={clusters as any} />
  )
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
