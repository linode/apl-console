/* eslint-disable @typescript-eslint/no-floating-promises */
import Workload from 'components/Workload'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateWorkloadMutation,
  useDeleteWorkloadMutation,
  useEditWorkloadMutation,
  useGetWorkloadQuery,
} from 'redux/otomiApi'

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
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: createData }] =
    useCreateWorkloadMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditWorkloadMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteWorkloadMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetWorkloadQuery(
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
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/workloads`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/workloads/${createData.id}`} />
  const handleSubmit = (formData) => {
    if (workloadId) update({ teamId, workloadId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, workloadId: deleteId })
  const comp = !isError && (
    <Workload onSubmit={handleSubmit} workload={data} onDelete={handleDelete} teamId={teamId} mutating={mutating} />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_WORKLOAD', { workloadId, role: 'team' })} />
}
