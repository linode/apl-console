/* eslint-disable @typescript-eslint/no-floating-promises */
import WorkloadValues from 'components/WorkloadValues'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useEditWorkloadValuesMutation, useGetWorkloadValuesQuery } from 'redux/otomiApi'

interface Params {
  teamId: string
  workloadId?: string
}

export default function ({
  match: {
    params: { teamId, workloadId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditWorkloadValuesMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetWorkloadValuesQuery(
    { teamId, workloadId },
    { skip: !workloadId },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingUpdate
  if (!mutating && isSuccessUpdate) return <Redirect to={`/teams/${teamId}/workloads`} />
  const handleSubmit = (formData) => {
    update({ teamId, workloadId, body: { id: workloadId, values: formData } as any })
  }
  const comp = !isError && !isLoading && <WorkloadValues onSubmit={handleSubmit} workloadValues={data} />
  return (
    <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_WORKLOAD_VALUES', { workloadId, role: 'team' })} />
  )
}
