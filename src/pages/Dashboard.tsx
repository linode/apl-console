/* eslint-disable no-prototype-builtins */
import { Team } from '@redkubes/otomi-api-client-axios'
import Dashboard from 'components/Dashboard'
import useApi, { useAuthz } from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import find from 'lodash/find'
import React from 'react'

export default function (): React.ReactElement {
  const {
    sess: {
      user: { isAdmin },
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
  const comp = !(err || loading) && <Dashboard services={services} team={team} teams={teams} />
  return <PaperLayout loading={loading} comp={comp} />
}
