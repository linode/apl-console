import { skipToken } from '@reduxjs/toolkit/dist/query'
import Policies from 'components/Policies'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllPoliciesQuery, useGetTeamPoliciesQuery } from 'redux/otomiApi'
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
    data: allPolicies,
    isLoading: isLoadingAllPolicies,
    isFetching: isFetchingAllPolicies,
    refetch: refetchAllPolicies,
  } = useGetAllPoliciesQuery(teamId ? skipToken : undefined)
  const {
    data: teamPolicies,
    isLoading: isLoadingTeamPolicies,
    isFetching: isFetchingTeamPolicies,
    refetch: refetchTeamPolicies,
  } = useGetTeamPoliciesQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllPolicies) refetchAllPolicies()
    else if (teamId && !isFetchingTeamPolicies) refetchTeamPolicies()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS
  const loading = isLoadingAllPolicies || isLoadingTeamPolicies
  const policies = teamId ? teamPolicies : allPolicies
  const comp = policies && <Policies policies={policies} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_WORKLOADS', { scope: getRole(teamId) })} />
}
