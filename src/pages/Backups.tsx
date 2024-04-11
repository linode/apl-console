import { skipToken } from '@reduxjs/toolkit/dist/query'
import Backups from 'components/Backups'
import Forbidden from 'components/Forbidden'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllBackupsQuery, useGetTeamBackupsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const authzSession = useAuthzSession(teamId)
  if (!authzSession) return <PaperLayout comp={<Forbidden />} />
  const {
    data: allBackups,
    isLoading: isLoadingAllBackups,
    isFetching: isFetchingAllBackups,
    refetch: refetchAllBackups,
  } = useGetAllBackupsQuery(teamId ? skipToken : undefined)
  const {
    data: teamBackups,
    isLoading: isLoadingTeamBackups,
    isFetching: isFetchingTeamBackups,
    refetch: refetchTeamBackups,
  } = useGetTeamBackupsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllBackups) refetchAllBackups()
    else if (teamId && !isFetchingTeamBackups) refetchTeamBackups()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllBackups || isLoadingTeamBackups
  const backups = teamId ? teamBackups : allBackups
  const comp = backups && <Backups backups={backups} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_BACKUPS', { scope: getRole(teamId) })} />
}
