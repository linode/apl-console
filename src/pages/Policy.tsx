/* eslint-disable @typescript-eslint/no-floating-promises */
import Policy from 'components/Policy'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { find, omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { GetPolicyApiResponse, useEditPolicyMutation, useGetPolicyQuery, useGetTeamsQuery } from 'redux/otomiApi'

interface Params {
  teamId: string
  policyName?: string
}

export default function ({
  match: {
    params: { teamId, policyName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    user: { isPlatformAdmin },
  } = useAuthzSession(teamId)
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditPolicyMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetPolicyQuery(
    { teamId, policyName },
    { skip: !policyName },
  )
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    refetch: refetchTeams,
  } = useGetTeamsQuery()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
    if (teamId && !isFetchingTeams) refetchTeams()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const team = !isLoadingTeams && find(teams, { id: teamId })
  const editPolicies = team?.selfService?.teamMembers?.editSecurityPolicies || teamId === 'admin' || isPlatformAdmin
  const loading = isLoading || isLoadingTeams
  const mutating = isLoadingUpdate
  if (!mutating && isSuccessUpdate) return <Redirect to={`/teams/${teamId}/policies`} />
  const handleSubmit = (formData) => {
    if (!editPolicies) return
    if (policyName) update({ teamId, policyName, body: omit(formData, ['id', 'name']) as GetPolicyApiResponse })
  }
  const comp = teams && !isError && (
    <Policy
      onSubmit={handleSubmit}
      editPolicies={editPolicies}
      policy={data}
      teamId={teamId}
      mutating={mutating}
      policyName={policyName}
    />
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_BUILD', { policyName, role: 'team' })} />
}
