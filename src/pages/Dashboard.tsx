/* eslint-disable no-prototype-builtins */
import { Box } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import Dashboard from 'components/Dashboard'
import useSettings from 'hooks/useSettings'
import PaperLayout from 'layouts/Paper'
import find from 'lodash/find'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetDashboardQuery, useGetTeamQuery, useGetTeamsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const { themeView } = useSettings()
  const isPlatformView = themeView === 'platform'
  const {
    user: { isPlatformAdmin },
    oboTeamId,
  } = useSession()

  const {
    data: teams,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    refetch: refetchTeams,
  } = useGetTeamsQuery(!isPlatformAdmin && skipToken)
  const { data: teamData } = useGetTeamQuery({ teamId: oboTeamId }, { skip: !oboTeamId || isPlatformAdmin })

  const teamId = isPlatformView ? undefined : oboTeamId

  console.log('[Dashboard] Debug info:', {
    oboTeamId,
    isPlatformView,
    teamId,
    skipQuery: !isPlatformView && !teamId,
  })

  const {
    data: dashboard,
    isFetching: isFetchingDashboard,
    refetch: refetchDashboard,
  } = useGetDashboardQuery({ teamId }, { skip: !isPlatformAdmin && !teamId })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (oboTeamId && !isFetchingDashboard) refetchDashboard()
    if (oboTeamId && !isFetchingTeams) refetchTeams()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const team = !isLoadingTeams && (find(teams, { name: teamId }) || teamData)
  const loading = isFetchingDashboard || isLoadingTeams
  const teamInventory = isPlatformView ? [{ name: 'teams', count: teams?.length }] : []
  const dashboardInventory = dashboard ?? ([] as any)
  const inventory = [...teamInventory, ...dashboardInventory]
  const comp = (teams || team) && dashboard && <Dashboard team={team} inventory={inventory} />
  return (
    <Box sx={{ paddingTop: '3rem' }}>
      <PaperLayout
        loading={loading}
        comp={comp}
        title={t('TITLE_DASHBOARD', { role: isPlatformAdmin ? 'admin' : 'team' })}
      />
    </Box>
  )
}
