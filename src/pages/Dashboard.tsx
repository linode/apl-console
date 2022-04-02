/* eslint-disable no-prototype-builtins */
import { skipToken } from '@reduxjs/toolkit/dist/query'
import Dashboard from 'components/Dashboard'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import find from 'lodash/find'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAllServicesQuery, useGetTeamServicesQuery, useGetTeamsQuery } from 'redux/otomiApi'
import { k } from 'translations/keys'

export default function (): React.ReactElement {
  const {
    user: { isAdmin },
    oboTeamId: tid,
  } = useAuthzSession()
  const {
    data: allServices,
    error: errorAllServices,
    isFetching: isFetchingAllServices,
  } = useGetAllServicesQuery(!isAdmin ? skipToken : undefined)
  const {
    data: teamServices,
    error: errorTeamServices,
    isFetching: isFetchingTeamServices,
  } = useGetTeamServicesQuery(isAdmin ? skipToken : undefined)
  const { data: teams, error: errorTeams, isLoading: isLoadingTeams } = useGetTeamsQuery()
  const { t } = useTranslation()
  // END HOOKS
  const team = !(isLoadingTeams || errorTeams) && find(teams, { id: tid })
  const err = errorAllServices || errorTeamServices || errorTeams
  const loading = isFetchingAllServices || isFetchingTeamServices || isLoadingTeams
  const services = isAdmin ? allServices : teamServices
  const comp = !(err || loading) && services && <Dashboard services={services} team={team} teams={teams} />
  return (
    <PaperLayout loading={loading} comp={comp} title={t(k.TITLE_DASHBOARD, { role: isAdmin ? 'admin' : 'team' })} />
  )
}
