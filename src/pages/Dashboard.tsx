/* eslint-disable no-prototype-builtins */
import { skipToken } from '@reduxjs/toolkit/dist/query'
import Dashboard from 'components/Dashboard'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import find from 'lodash/find'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAllServicesQuery, useGetTeamServicesQuery, useGetTeamsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const {
    user: { isAdmin },
    oboTeamId: tid,
  } = useAuthzSession()
  const { data: allServices, isFetching: isFetchingAllServices } = useGetAllServicesQuery(
    !isAdmin ? skipToken : undefined,
  )
  const { data: teamServices, isFetching: isFetchingTeamServices } = useGetTeamServicesQuery(
    { teamId: tid },
    { skip: isAdmin },
  )
  const { data: teams, isLoading: isLoadingTeams } = useGetTeamsQuery()
  const { t } = useTranslation()
  // END HOOKS
  const team = !isLoadingTeams && find(teams, { id: tid })
  const loading = isFetchingAllServices || isFetchingTeamServices || isLoadingTeams
  const services = isAdmin ? allServices : teamServices
  const comp = services && teams && <Dashboard services={services} team={team} teams={teams} />
  return (
    <PaperLayout loading={loading} comp={comp} title={t('TITLE_DASHBOARD', { role: isAdmin ? 'admin' : 'team' })} />
  )
}
