import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import YAML from 'yaml'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps, useHistory } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { makeStyles } from 'tss-react/mui'

import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
import {
  CreateAplWorkloadApiResponse,
  useCreateAplWorkloadMutation,
  useDeleteAplWorkloadMutation,
  useEditAplWorkloadMutation,
  useGetAplWorkloadQuery,
  useGetWorkloadCatalogMutation,
} from 'redux/otomiApi'
import DeleteButton from 'components/DeleteButton'
import { DocsLink } from 'components/DocsLink'
import CodeEditor from './WorkloadsCodeEditor'
import { createAplWorkloadApiResponseSchema } from './create-edit-workloads.validator'

const useStyles = makeStyles()((theme) => ({
  header: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    width: '100%',
    left: 0,
    backgroundColor: theme.palette.background.default,
  },
  imgHolder: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    display: 'inline-flex',
  },
  img: {
    height: theme.spacing(6),
  },
}))

export const getDocsLink = (url: string, path: string): string => {
  if (process.env.NODE_ENV === 'development') return `${url.replace('.git', '')}/blob/main/${path}/README.md`
  return `${url.replace('.git', '')}/src/branch/main/${path}/README.md`
}

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
  const history = useHistory()
  const dispatch = useAppDispatch()
  const { classes } = useStyles()

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

  // Normalise spec.values from the new GET to always be a string in the form
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

  // When editing, use workload from API; when creating, use catalog item
  const workloadData = workloadName ? workload : catalogItem
  const valuesData = workloadName ? workload?.spec?.values : catalogItem?.values
  const valuesSchema = catalogItem?.valuesSchema

  // Local state for the inlined Catalog behaviour
  const [data, setData] = useState<any>(workloadData)
  const [workloadValuesYaml, setWorkloadValuesYaml] = useState(
    typeof valuesData === 'string' ? valuesData : YAML.stringify(valuesData ?? {}),
  )

  // Keep local state in sync when workload/cataIog changes
  useEffect(() => {
    if (!workloadData) return
    setData(workloadData)
    setWorkloadValuesYaml(typeof valuesData === 'string' ? valuesData : YAML.stringify(valuesData ?? {}))
  }, [workloadData, valuesData])

  // Refetch workload when dirty flag resets (edit mode only)
  useEffect(() => {
    if (isDirty !== false) return
    if (!workloadName) return
    if (!isFetchingWorkload) refetchWorkload()
  }, [isDirty, workloadName, isFetchingWorkload, refetchWorkload])

  const mutating = isLoadingDWL
  if (!mutating && isSuccessDWL) return <Redirect to={`/teams/${teamId}/workloads`} />

  const icon = data?.icon || '/logos/akamai_logo.svg'

  const handleCreateUpdateWorkload = async () => {
    const workloadBody = omit(data, ['chartProvider', 'chart', 'revision'])
    const chartMetadata = omit(data?.chartMetadata, ['helmChartCatalog', 'helmChart'])
    const path = workloadData?.path

    const body = {
      kind: 'AplTeamWorkload',
      metadata: {
        name: workloadName ?? data?.name,
        labels: { 'apl.io/teamId': teamId },
      },
      spec: {
        ...workloadBody,
        chartMetadata,
        url: workloadData?.url,
        path,
        values: workloadValuesYaml,
      },
    }

    let res
    if (workloadName) {
      dispatch(setError(undefined))
      res = await updateWorkload({ teamId, workloadName, body })
    } else res = await createWorkload({ teamId, body })

    if (!res.error) history.push(`/teams/${teamId}/workloads`)
  }

  const comp = !isErrorWorkload && (
    <Box sx={{ width: '100%' }}>
      <Box className={classes.header}>
        <Box className={classes.imgHolder}>
          <img
            className={classes.img}
            src={icon}
            onError={({ currentTarget }) => {
              // eslint-disable-next-line no-param-reassign
              currentTarget.onerror = null
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = `${icon}`
            }}
            alt={`Logo for ${icon}`}
          />
        </Box>
        <Box>
          <Typography variant='h6'>
            {workloadData?.name ? `${workloadData.name} (${workloadData.path})` : workloadData?.path}
          </Typography>
        </Box>
        {workloadData?.url && workloadData?.path && (
          <Box sx={{ ml: 'auto' }}>
            <DocsLink href={getDocsLink(workloadData.url as string, workloadData.path as string)} />
          </Box>
        )}
      </Box>

      {/* <Form
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onChange={setData}
        resourceType='Workload'
        children
        hideHelp
        liveValidate={data?.name || data?.namespace}
        mutating={mutating}
      /> */}

      <CodeEditor code={workloadValuesYaml} onChange={setWorkloadValuesYaml} validationSchema={valuesSchema} />

      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', float: 'right', mt: 2 }}>
        <ButtonGroup sx={{ gap: '10px' }}>
          <Button variant='contained' onClick={handleCreateUpdateWorkload}>
            Submit
          </Button>
          {workloadName && (
            <DeleteButton
              onDelete={() => deleteWorkload({ teamId, workloadName })}
              resourceName={workloadData?.name}
              resourceType='workload'
              data-cy='button-delete-workload'
            />
          )}
        </ButtonGroup>
      </Box>
    </Box>
  )

  return (
    <PaperLayout
      loading={isLoadingWorkload || isLoadingCatalog}
      comp={comp}
      title={t('TITLE_WORKLOAD', { workloadName, role: 'team' })}
    />
  )
}
