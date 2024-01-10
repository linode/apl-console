/* eslint-disable @typescript-eslint/no-floating-promises */
import Policy from 'components/Policy'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useEditPolicyMutation, useGetPolicyQuery } from 'redux/otomiApi'

interface Params {
  teamId: string
  policyId?: string
}

export default function ({
  match: {
    params: { teamId, policyId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditPolicyMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetPolicyQuery({ teamId, policyId }, { skip: !policyId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingUpdate
  if (!mutating && isSuccessUpdate) return <Redirect to={`/teams/${teamId}/policies`} />
  const handleSubmit = (formData) => {
    if (policyId) update({ teamId, policyId, body: omit(formData, ['id', 'teamId']) as any })
  }
  const comp = !isError && <Policy onSubmit={handleSubmit} policy={data} teamId={teamId} mutating={mutating} />
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_BUILD', { policyId, role: 'team' })} />
}
