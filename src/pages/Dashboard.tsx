/* eslint-disable no-prototype-builtins */
import { skipToken } from '@reduxjs/toolkit/dist/query'
import Dashboard from 'components/Dashboard'
import useAuthzSession from 'hooks/useAuthzSession'
import useSettings from 'hooks/useSettings'
import PaperLayout from 'layouts/Paper'
import find from 'lodash/find'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import {
  useGetAllBuildsQuery,
  useGetAllProjectsQuery,
  useGetAllSecretsQuery,
  useGetAllServicesQuery,
  useGetAllWorkloadsQuery,
  useGetTeamBuildsQuery,
  useGetTeamProjectsQuery,
  useGetTeamServicesQuery,
  useGetTeamWorkloadsQuery,
  useGetTeamsQuery,
} from 'redux/otomiApi'

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
    data: allProjects,
    isFetching: isFetchingAllProjects,
    refetch: refetchAllProjects,
  } = useGetAllProjectsQuery(!isAdmin ? skipToken : undefined)
  const {
    data: teamProjects,
    isFetching: isFetchingTeamProjects,
    refetch: refetchTeamProjects,
  } = useGetTeamProjectsQuery({ teamId })

  const {
    data: allBuilds,
    isFetching: isFetchingAllBuilds,
    refetch: refetchAllBuilds,
  } = useGetAllBuildsQuery(!isAdmin ? skipToken : undefined)
  const {
    data: teamBuilds,
    isFetching: isFetchingTeamBuilds,
    refetch: refetchTeamBuilds,
  } = useGetTeamBuildsQuery({ teamId })

  const {
    data: allWorkloads,
    isFetching: isFetchingAllWorkloads,
    refetch: refetchAllWorkloads,
  } = useGetAllWorkloadsQuery(!isAdmin ? skipToken : undefined)
  const {
    data: teamWorkloads,
    isFetching: isFetchingTeamWorkloads,
    refetch: refetchTeamWorkloads,
  } = useGetTeamWorkloadsQuery({ teamId })

  const {
    data: allServices,
    isFetching: isFetchingAllServices,
    refetch: refetchAllServices,
  } = useGetAllServicesQuery(!isAdmin ? skipToken : undefined)
  const {
    data: teamServices,
    isFetching: isFetchingTeamServices,
    refetch: refetchTeamServices,
  } = useGetTeamServicesQuery({ teamId })

  const {
    data: allSecrets,
    isFetching: isFetchingAllSecrets,
    refetch: refetchAllSecrets,
  } = useGetAllSecretsQuery(!isAdmin ? skipToken : undefined)

  const filteredSecrets = () => {
    if (teamId === 'admin') return allSecrets
    return allSecrets?.filter((secret: any) => secret.teamId === teamId)
  }

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
  const projects = teamId === 'admin' ? allProjects : teamProjects
  const builds = teamId === 'admin' ? allBuilds : teamBuilds
  const workloads = teamId === 'admin' ? allWorkloads : teamWorkloads
  const services = teamId === 'admin' ? allServices : teamServices
  const secrets = filteredSecrets()
  const teamInventory = themeView === 'platform' ? [{ name: 'teams', count: teams?.length }] : []
  const inventory = [
    ...teamInventory,
    { name: 'projects', count: projects?.length },
    { name: 'builds', count: builds?.length },
    { name: 'workloads', count: workloads?.length },
    { name: 'services', count: services?.length },
    { name: 'secrets', count: secrets?.length },
  ]
  const comp = services && teams && <Dashboard team={team} inventory={inventory} />
  return (
    <PaperLayout loading={loading} comp={comp} title={t('TITLE_DASHBOARD', { role: isAdmin ? 'admin' : 'team' })} />
  )
}
