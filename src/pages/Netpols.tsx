import { skipToken } from '@reduxjs/toolkit/query/react'
import Netpols from 'components/Netpols'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllNetpolsQuery, useGetTeamNetpolsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    data: allNetpols,
    isLoading: isLoadingAllNetpols,
    isFetching: isFetchingAllNetpols,
    refetch: refetchAllNetpols,
  } = useGetAllNetpolsQuery(teamId ? skipToken : undefined)
  const {
    data: teamNetpols,
    isLoading: isLoadingTeamNetpols,
    isFetching: isFetchingTeamNetpols,
    refetch: refetchTeamNetpols,
  } = useGetTeamNetpolsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllNetpols) refetchAllNetpols()
    else if (teamId && !isFetchingTeamNetpols) refetchTeamNetpols()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllNetpols || isLoadingTeamNetpols
  const netpols = teamId ? teamNetpols : allNetpols
  const comp = netpols && <Netpols teamId={teamId} netpols={netpols} />
  return <PaperLayout loading={loading} comp={comp} title={t('Network Policies', { role: getRole(teamId) })} />
}
