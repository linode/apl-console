/* eslint-disable no-prototype-builtins */
import { skipToken } from '@reduxjs/toolkit/dist/query'
import Dashboard from 'components/Dashboard'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import find from 'lodash/find'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetAllServicesQuery, useGetTeamServicesQuery, useGetTeamsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const {
    user: { isAdmin },
    oboTeamId: teamId,
  } = useAuthzSession()
  const {
    data: allServices,
    isFetching: isFetchingAllServices,
    refetch: refetchAllServices,
  } = useGetAllServicesQuery(!isAdmin ? skipToken : undefined)
  const {
    data: teamServices,
    isFetching: isFetchingTeamServices,
    refetch: refetchTeamServices,
  } = useGetTeamServicesQuery({ teamId }, { skip: isAdmin })
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    refetch: refetchTeams,
  } = useGetTeamsQuery()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllServices) refetchAllServices()
    if (teamId && !isFetchingTeamServices) refetchTeamServices()
    if (teamId && !isFetchingTeams) refetchTeams()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const team = !isLoadingTeams && find(teams, { id: teamId })
  const loading = isFetchingAllServices || isFetchingTeamServices || isLoadingTeams
  const services = isAdmin ? allServices : teamServices
  const comp = services && teams && <Dashboard services={services} team={team} teams={teams} />
  return (
    <PaperLayout loading={loading} comp={comp} title={t('TITLE_DASHBOARD', { role: isAdmin ? 'admin' : 'team' })} />
  )
}
