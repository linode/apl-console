import { skipToken } from '@reduxjs/toolkit/dist/query'
import CodeRepositories from 'components/CodeRepositories'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllCodereposQuery, useGetTeamCodereposQuery } from 'redux/otomiApi'
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
    data: allCodeRepositories,
    isLoading: isLoadingAllCodeRepositories,
    isFetching: isFetchingAllCodeRepositories,
    refetch: refetchAllCodeRepositories,
  } = useGetAllCodereposQuery(teamId ? skipToken : undefined)
  const {
    data: teamCodeRepositories,
    isLoading: isLoadingTeamCodeRepositories,
    isFetching: isFetchingTeamCodeRepositories,
    refetch: refetchTeamCodeRepositories,
  } = useGetTeamCodereposQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllCodeRepositories) refetchAllCodeRepositories()
    else if (teamId && !isFetchingTeamCodeRepositories) refetchTeamCodeRepositories()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS

  const loading = isLoadingAllCodeRepositories || isLoadingTeamCodeRepositories
  const coderepos = teamId ? teamCodeRepositories : allCodeRepositories
  console.log('coderepos', coderepos)
  const comp = coderepos && <CodeRepositories coderepos={coderepos} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_CODEREPOSITORIES', { scope: getRole(teamId) })} />
}
