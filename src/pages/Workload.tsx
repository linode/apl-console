/* eslint-disable @typescript-eslint/no-floating-promises */
import Workload from 'components/Workload'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateWorkloadMutation,
  useDeleteWorkloadMutation,
  useEditWorkloadMutation,
  useGetWorkloadQuery,
  useUpdateWorkloadValuesMutation,
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
  const { t } = useTranslation()
  const [createWL, { isLoading: isLoadingCWL, data: createWLData }] = useCreateWorkloadMutation()
  const [updateWL] = useEditWorkloadMutation()
  const {
    data: WLData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetWorkloadQuery({ teamId, workloadId: workloadId || createWLData?.id }, { skip: !workloadId })
  const [updateWLValues] = useUpdateWorkloadValuesMutation()
  const [deleteWL, { isLoading: isLoadingDWL, isSuccess: isSuccessDWL }] = useDeleteWorkloadMutation()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  // END HOOKS
  const mutating = isLoadingCWL || isLoadingDWL
  if (!mutating && isSuccessDWL) return <Redirect to={`/teams/${teamId}/workloads`} />

  const comp = !isError && (
    <Workload
      teamId={teamId}
      workload={WLData || createWLData}
      workloadId={workloadId || createWLData?.id}
      mutating={mutating}
      createWorkload={createWL}
      updateWorkload={updateWL}
      updateWorkloadValues={updateWLValues}
      deleteWorkload={deleteWL}
    />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_WORKLOAD', { workloadId, role: 'team' })} />
}
