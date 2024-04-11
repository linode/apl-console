import { skipToken } from '@reduxjs/toolkit/dist/query'
import Builds from 'components/Builds'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllBuildsQuery, useGetTeamBuildsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // const globalError = useAppSelector(({ global: { error } }) => error) || {}
  // console.log('Error code: ', globalError.code)
  // console.log('globalError', globalError)
  // if (globalError?.code === 403) return null
  const {
    data: allBuilds,
    isLoading: isLoadingAllBuilds,
    isFetching: isFetchingAllBuilds,
    refetch: refetchAllBuilds,
  } = useGetAllBuildsQuery(teamId ? skipToken : undefined)
  const {
    data: teamBuilds,
    isLoading: isLoadingTeamBuilds,
    isFetching: isFetchingTeamBuilds,
    refetch: refetchTeamBuilds,
  } = useGetTeamBuildsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllBuilds) refetchAllBuilds()
    else if (teamId && !isFetchingTeamBuilds) refetchTeamBuilds()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllBuilds || isLoadingTeamBuilds
  const builds = teamId ? teamBuilds : allBuilds
  const comp = builds && <Builds builds={builds} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_BUILDS', { scope: getRole(teamId) })} />
}
