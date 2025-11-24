import Catalog from 'components/Catalog'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  CreateAplWorkloadApiResponse,
  useCreateAplWorkloadMutation,
  useDeleteAplWorkloadMutation,
  useEditAplWorkloadMutation,
  useGetAplWorkloadQuery,
  useGetWorkloadCatalogMutation,
} from 'redux/otomiApi'
import { yupResolver } from '@hookform/resolvers/yup'
import { createAplWorkloadApiResponseSchema } from './create-edit-workloads.validator'

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
  const {
    data: workload,
    isLoading: isLoadingWorkload,
    isFetching: isFetchingWorkload,
    isError: isErrorWorkload,
    refetch: refetchWorkload,
  } = useGetAplWorkloadQuery({ teamId, workloadName }, { skip: !workloadName })

  const [createWorkload] = useCreateAplWorkloadMutation()
  const [updateWorkload] = useEditAplWorkloadMutation()
  const [deleteWorkload, { isLoading: isLoadingDWL, isSuccess: isSuccessDWL }] = useDeleteAplWorkloadMutation()

  const [getWorkloadCatalog, { isLoading: isLoadingCatalog }] = useGetWorkloadCatalogMutation()
  const [catalogItem, setCatalogItem] = useState<any>({})

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  let normalisedValues = ''
  const rawValues = workload?.spec?.values

  if (typeof rawValues === 'string') normalisedValues = rawValues
  else if (rawValues) normalisedValues = JSON.stringify(rawValues, null, 2)

  const mergedDefaultValues = createAplWorkloadApiResponseSchema.cast({
    ...workload,
    kind: workload?.kind ?? 'AplTeamWorkload',

    metadata: {
      ...workload?.metadata,
      name: workload?.metadata?.name ?? '',
      labels: {
        ...workload?.metadata?.labels,
        'apl.io/teamId': workload?.metadata?.labels?.['apl.io/teamId'] ?? teamId,
      },
    },

    spec: {
      ...workload?.spec,
      url: workload?.spec?.url ?? '',
      chartProvider: workload?.spec?.chartProvider ?? 'helm',
      imageUpdateStrategy: workload?.spec?.imageUpdateStrategy ?? { type: 'disabled' },
      values: normalisedValues,
    },
  }) as CreateAplWorkloadApiResponse

  const methods = useForm<CreateAplWorkloadApiResponse>({
    resolver: yupResolver(createAplWorkloadApiResponseSchema),
    defaultValues: mergedDefaultValues,
  })

  // Fetch catalog info only when creating (no workloadName)
  useEffect(() => {
    if (workloadName) return

    getWorkloadCatalog({ body: { url: '', sub: user.sub, teamId } }).then((res: any) => {
      const { url, catalog }: { url: string; catalog: any[] } = res.data
      const item = catalog.find((item) => item.name === catalogName)
      if (!item) return

      const {
        chartVersion: helmChartVersion,
        chartDescription: helmChartDescription,
        name: path,
        values,
        valuesSchema,
        icon,
      } = item
      const chartMetadata = { helmChartVersion, helmChartDescription }
      setCatalogItem({ chartMetadata, path, values, valuesSchema, url, icon })
    })
  }, [workload])

  const workloadData = workloadName ? workload : catalogItem
  const valuesData = workloadName ? workload?.spec?.values : catalogItem?.values
  const valuesSchema = catalogItem?.valuesSchema

  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetchingWorkload) refetchWorkload()
  }, [isDirty])

  const mutating = isLoadingDWL
  if (!mutating && isSuccessDWL) return <Redirect to={`/teams/${teamId}/workloads`} />

  const comp = !isErrorWorkload && (
    <Catalog
      teamId={teamId}
      workload={workloadData}
      workloadName={workloadName}
      values={valuesData}
      valuesSchema={valuesSchema}
      createWorkload={createWorkload}
      updateWorkload={updateWorkload}
      deleteWorkload={deleteWorkload}
      mutating={mutating}
    />
  )

  return (
    <PaperLayout
      loading={isLoadingWorkload || isLoadingCatalog}
      comp={comp}
      title={t('TITLE_WORKLOAD', { workloadName, role: 'team' })}
    />
  )
}
