import { skipToken } from '@reduxjs/toolkit/dist/query'
import Users from 'components/Users'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllUsersQuery, useGetTeamUsersQuery } from 'redux/otomiApi'
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
    data: allUsers,
    isLoading: isLoadingAllUsers,
    isFetching: isFetchingAllUsers,
    refetch: refetchAllUsers,
  } = useGetAllUsersQuery(teamId ? skipToken : undefined)
  const {
    data: teamUsers,
    isLoading: isLoadingTeamUsers,
    isFetching: isFetchingTeamUsers,
    refetch: refetchTeamUsers,
  } = useGetTeamUsersQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllUsers) refetchAllUsers()
    else if (teamId && !isFetchingTeamUsers) refetchTeamUsers()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllUsers || isLoadingTeamUsers
  const users = teamId ? teamUsers : allUsers
  const comp = users && <Users users={users} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_USERS', { scope: getRole(teamId) })} />
}
