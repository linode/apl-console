import Catalog from 'components/Catalog'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateAplWorkloadMutation,
  useDeleteAplWorkloadMutation,
  useEditAplWorkloadMutation,
  useGetWorkloadQuery,
  useGetWorkloadValuesQuery,
  useWorkloadCatalogMutation,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  workloadName?: string
  catalogName?: string
}

export default function WorkloadsCreateEditPage({
  match: {
    params: { teamId, workloadName, catalogName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()
  const { user } = useSession()
  // Get Queries should be migrated to v2 in workload phase 4
  const {
    data: workload,
    isLoading: isLoadingWorkload,
    isFetching: isFetchingWorkload,
    isError: isErrorWorkload,
    refetch: refetchWorkload,
  } = useGetWorkloadQuery({ teamId, workloadName }, { skip: !workloadName })
  const [createWorkload] = useCreateAplWorkloadMutation()
  const [updateWorkload] = useEditAplWorkloadMutation()
  const [deleteWorkload, { isLoading: isLoadingDWL, isSuccess: isSuccessDWL }] = useDeleteAplWorkloadMutation()

  // Get Queries should be migrated to v2 in workload phase 4
  const {
    data: values,
    isLoading: isLoadingValues,
    isFetching: isFetchingValues,
    isError: isErrorValues,
    refetch: refetchValues,
  } = useGetWorkloadValuesQuery({ teamId, workloadName }, { skip: !workloadName })

  const [getWorkloadCatalog, { isLoading: isLoadingCatalog }] = useWorkloadCatalogMutation()
  const [catalogItem, setCatalogItem] = useState<any>({})
  const [readme, setReadme] = useState<string>('')

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (workloadName) {
      if (workload?.name) {
        getWorkloadCatalog({ body: { url: '', sub: user.sub, teamId } }).then((res: any) => {
          const { catalog }: { catalog: any[] } = res.data
          const item = catalog.find((item) => item.name === workload.path)
          const { readme } = item
          setReadme(readme)
        })
      }
      return
    }
    getWorkloadCatalog({ body: { url: '', sub: user.sub, teamId } }).then((res: any) => {
      const { url, catalog }: { url: string; catalog: any[] } = res.data
      const item = catalog.find((item) => item.name === catalogName)
      const {
        chartVersion: helmChartVersion,
        chartDescription: helmChartDescription,
        name: path,
        values,
        icon,
        readme,
      } = item
      const chartMetadata = { helmChartVersion, helmChartDescription }
      setCatalogItem({ chartMetadata, path, values, url, icon })
      setReadme(readme)
    })
  }, [workload])

  const workloadData = workloadName ? workload : catalogItem
  const valuesData = workloadName ? values?.values : catalogItem?.values

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
      workloadName={workloadName}
      values={valuesData}
      createWorkload={createWorkload}
      updateWorkload={updateWorkload}
      deleteWorkload={deleteWorkload}
      mutating={mutating}
      readme={readme}
    />
  )
  return (
    <PaperLayout
      loading={isLoadingWorkload || isLoadingValues || isLoadingCatalog}
      comp={comp}
      title={t('TITLE_WORKLOAD', { workloadName, role: 'team' })}
    />
  )
}
