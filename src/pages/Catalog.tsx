/* eslint-disable @typescript-eslint/no-floating-promises */
import Catalog from 'components/Catalog'
import LoadingScreen from 'components/LoadingScreen'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateWorkloadMutation,
  useDeleteWorkloadMutation,
  useEditWorkloadMutation,
  useGetWorkloadQuery,
  useUpdateWorkloadValuesMutation,
  useWorkloadCatalogMutation,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  workloadId?: string
  catalogName?: string
}

export default function ({
  match: {
    params: { teamId, workloadId, catalogName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const { t } = useTranslation()
  const session = useSession()
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
  const [getWorkloadCatalog, { isLoading: isLoadingItem }] = useWorkloadCatalogMutation()
  const [item, setItem] = useState<any>({})
  useEffect(() => {
    getWorkloadCatalog({ body: { url: '', sub: session.user.sub, teamId } }).then((res: any) => {
      const { url, catalog }: { url: string; catalog: any[] } = res.data
      const item = catalog.find((item) => item.name === catalogName)
      setItem({ ...item, url })
    })
  }, [])
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  // END HOOKS
  const mutating = isLoadingCWL || isLoadingDWL
  if (!mutating && isSuccessDWL) return <Redirect to={`/teams/${teamId}/workloads`} />

  if (isLoadingItem || !item) return <LoadingScreen />

  const comp = !isError && (
    <Catalog
      teamId={teamId}
      workload={WLData || createWLData}
      workloadId={workloadId || createWLData?.id}
      mutating={mutating}
      createWorkload={createWL}
      updateWorkload={updateWL}
      updateWorkloadValues={updateWLValues}
      deleteWorkload={deleteWL}
      item={item}
    />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_WORKLOAD', { workloadId, role: 'team' })} />
}
