import { skipToken } from '@reduxjs/toolkit/dist/query'
import Projects from 'components/Projects'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps, useLocation } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllProjectsQuery, useGetTeamProjectsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { state } = useLocation()

  const {
    data: allProjects,
    isLoading: isLoadingAllProjects,
    isFetching: isFetchingAllProjects,
    refetch: refetchAllProjects,
  } = useGetAllProjectsQuery(teamId ? skipToken : undefined)

  const {
    data: teamProjects,
    isLoading: isLoadingTeamProjects,
    isFetching: isFetchingTeamProjects,
    refetch: refetchTeamProjects,
  } = useGetTeamProjectsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllProjects) refetchAllProjects()
    else if (teamId && !isFetchingTeamProjects) refetchTeamProjects()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllProjects || isLoadingTeamProjects
  const projects = teamId ? teamProjects : allProjects
  const comp = projects && <Projects projects={projects} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_WORKLOADS', { scope: getRole(teamId) })} />
}
