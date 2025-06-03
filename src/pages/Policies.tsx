import { skipToken } from '@reduxjs/toolkit/query/react'
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
  let policies = []
  if (teamId && teamPolicies)
    policies = Object.entries(teamPolicies).map(([key, value]: any) => ({ name: key, ...value, teamId }))
  else if (allPolicies) {
    policies = Object.entries(allPolicies).flatMap(([teamId, policies]) =>
      Object.entries(policies).map(([key, value]: any) => ({ name: key, ...value, teamId })),
    )
  }
  const comp = policies && <Policies policies={policies} teamId={teamId} />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_POLICIES', { scope: getRole(teamId) })} />
}
