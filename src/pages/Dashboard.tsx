/* eslint-disable no-prototype-builtins */
import Dashboard from 'components/Dashboard'
import useAuthzSession from 'hooks/useAuthzSession'
import useSettings from 'hooks/useSettings'
import PaperLayout from 'layouts/Paper'
import find from 'lodash/find'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetDashboardQuery, useGetTeamsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const { themeView } = useSettings()
  const {
    user: { isAdmin },
    oboTeamId: teamId,
  } = useAuthzSession()

  const {
    data: teams,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    refetch: refetchTeams,
  } = useGetTeamsQuery()

  const {
    data: dashboard,
    isFetching: isFetchingDashboard,
    refetch: refetchDashboard,
  } = useGetDashboardQuery({ teamId })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (teamId && !isFetchingDashboard) refetchDashboard()
    if (teamId && !isFetchingTeams) refetchTeams()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const team = !isLoadingTeams && find(teams, { id: teamId })
  const loading = isFetchingDashboard || isLoadingTeams
  const teamInventory = themeView === 'platform' ? [{ name: 'teams', count: teams?.length }] : []
  const dashboardInventory = dashboard ?? ([] as any)
  const inventory = [...teamInventory, ...dashboardInventory]
  const comp = teams && dashboard && <Dashboard team={team} inventory={inventory} />
  return (
    <PaperLayout loading={loading} comp={comp} title={t('TITLE_DASHBOARD', { role: isAdmin ? 'admin' : 'team' })} />
  )
}
