/* eslint-disable @typescript-eslint/no-floating-promises */
import Catalog from 'components/Catalog'
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
  useGetWorkloadValuesQuery,
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
  const { user } = useSession()
  const {
    data: workload,
    isLoading: isLoadingWorkload,
    isFetching: isFetchingWorkload,
    isError: isErrorWorkload,
    refetch: refetchWorkload,
  } = useGetWorkloadQuery({ teamId, workloadId }, { skip: !workloadId })
  const [createWorkload] = useCreateWorkloadMutation()
  const [updateWorkload] = useEditWorkloadMutation()
  const [deleteWorkload, { isLoading: isLoadingDWL, isSuccess: isSuccessDWL }] = useDeleteWorkloadMutation()

  const {
    data: values,
    isLoading: isLoadingValues,
    isFetching: isFetchingValues,
    isError: isErrorValues,
    refetch: refetchValues,
  } = useGetWorkloadValuesQuery({ teamId, workloadId }, { skip: !workloadId })
  const [updateValues] = useUpdateWorkloadValuesMutation()

  const [getWorkloadCatalog, { isLoading: isLoadingCatalog }] = useWorkloadCatalogMutation()
  const [catalogItem, setCatalogItem] = useState<any>({})

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (workloadId) return
    getWorkloadCatalog({ body: { url: '', sub: user.sub, teamId } }).then((res: any) => {
      const { url, catalog }: { url: string; catalog: any[] } = res.data
      const item = catalog.find((item) => item.name === catalogName)
      const { chartVersion: helmChartVersion, chartDescription: helmChartDescription, name: path, values, icon } = item
      const chartMetadata = { helmChartVersion, helmChartDescription }
      setCatalogItem({ chartMetadata, path, values, url, icon })
    })
  }, [])

  const workloadData = workloadId ? workload : catalogItem
  const valuesData = workloadId ? values?.values : catalogItem?.values

  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetchingWorkload) refetchWorkload()
    if (!isFetchingValues) refetchValues()
  }, [isDirty])
  // END HOOKS
  const mutating = isLoadingDWL
  if (!mutating && isSuccessDWL) return <Redirect to={`/teams/${teamId}/workloads`} />

  const comp = !isErrorWorkload && !isErrorValues && (
    <Catalog
      teamId={teamId}
      workload={workloadData}
      workloadId={workloadId}
      values={valuesData}
      createWorkload={createWorkload}
      updateWorkload={updateWorkload}
      deleteWorkload={deleteWorkload}
      updateWorkloadValues={updateValues}
      mutating={mutating}
    />
  )
  return (
    <PaperLayout
      loading={isLoadingWorkload || isLoadingValues || isLoadingCatalog}
      comp={comp}
      title={t('TITLE_WORKLOAD', { workloadId, role: 'team' })}
    />
  )
}
