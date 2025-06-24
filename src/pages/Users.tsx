import Users from 'components/Users'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllUsersQuery } from 'redux/otomiApi'
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
  } = useGetAllUsersQuery()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetchingAllUsers) refetchAllUsers()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS
  const comp = allUsers && <Users users={allUsers} refetch={refetchAllUsers} teamId={teamId} />
  return <PaperLayout loading={isLoadingAllUsers} comp={comp} title={t('TITLE_USERS', { scope: getRole(teamId) })} />
}
