import { skipToken } from '@reduxjs/toolkit/dist/query'
import Sources from 'components/Sources'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllSourcesQuery, useGetTeamSourcesQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    data: allSources,
    isLoading: isLoadingAllSources,
    isFetching: isFetchingAllSources,
    refetch: refetchAllSources,
  } = useGetAllSourcesQuery(teamId ? skipToken : undefined)
  const {
    data: teamSources,
    isLoading: isLoadingTeamSources,
    isFetching: isFetchingTeamSources,
    refetch: refetchTeamSources,
  } = useGetTeamSourcesQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllSources) refetchAllSources()
    else if (teamId && !isFetchingTeamSources) refetchTeamSources()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllSources || isLoadingTeamSources
  const sources = teamId ? teamSources : allSources
  const comp = sources && <Sources sources={sources} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SOURCES', { scope: getRole(teamId) })} />
}
