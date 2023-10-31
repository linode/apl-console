/* eslint-disable react/button-has-type */
import { Box, Button } from '@mui/material'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import React, { useEffect, useState } from 'react'
import {
  GetSessionApiResponse,
  GetWorkloadApiResponse,
  useGetWorkloadValuesQuery,
  useWorkloadCatalogMutation,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useSession } from 'providers/Session'
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { useAppDispatch } from 'redux/hooks'
import { setError } from 'redux/reducers'
import Form from './rjsf/Form'
import WorkloadValues from './WorkloadValues'
import HeaderTitle from './HeaderTitle'
import DeleteButton from './DeleteButton'

export const getWorkloadSchema = (
  url?: string,
  helmCharts?: string[],
  helmChart?: string,
  helmChartVersion?: string,
  helmChartDescription?: string,
): any => {
  const schema = cloneDeep(getSpec().components.schemas.Workload)
  set(schema, 'properties.chart.properties.helmChartCatalog.default', url)
  set(schema, 'properties.chart.properties.helmChartCatalog.type', 'null')
  set(schema, 'properties.chart.properties.helmChartCatalog.listNotShort', true)
  set(schema, 'properties.chart.properties.helmChart.enum', helmCharts)
  set(schema, 'properties.chart.properties.helmChart.default', helmChart)
  set(schema, 'properties.chart.properties.helmChart.listNotShort', true)
  set(schema, 'properties.chart.properties.helmChartVersion.type', 'null')
  set(schema, 'properties.chart.properties.helmChartVersion.default', helmChartVersion)
  set(schema, 'properties.chart.properties.helmChartDescription.type', 'null')
  set(schema, 'properties.chart.properties.helmChartDescription.default', helmChartDescription)
  return schema
}

export const getWorkloadUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  workload?: GetWorkloadApiResponse
  workloadId?: string
  createWorkload: any
  updateWorkload: any
  updateWorkloadValues: any
  deleteWorkload: any
}

export default function ({
  teamId,
  workload,
  workloadId,
  createWorkload,
  updateWorkload,
  updateWorkloadValues,
  deleteWorkload,
  ...other
}: Props): React.ReactElement {
  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { appsEnabled, user, oboTeamId } = useSession()
  const [data, setData] = useState<GetWorkloadApiResponse>(workload)
  const { data: valuesData } = useGetWorkloadValuesQuery({ teamId, workloadId }, { skip: !workloadId })
  const [workloadValues, setWorkloadValues] = useState<any>(valuesData?.values)
  const [getWorkloadCatalog] = useWorkloadCatalogMutation()
  const [helmCharts, setHelmCharts] = useState<string[]>([])
  const [catalog, setCatalog] = useState<any[]>([])
  const [url, setUrl] = useState(workload?.chart?.helmChartCatalog)

  const resourceType = 'Workload'
  let title: string
  if (workloadId) title = t('FORM_TITLE_TEAM', { model: t(resourceType), name: workload.name, teamId: oboTeamId })
  if (!workloadId) title = t('FORM_TITLE_TEAM_NEW', { model: t(resourceType), teamId: oboTeamId })

  // get the helm charts and catalog based on the helm chart catalog url
  useEffect(() => {
    getWorkloadCatalog({ body: { url, sub: user.sub } }).then((res: any) => {
      const { url, helmCharts, catalog }: { url: string; helmCharts: string[]; catalog: any[] } = res.data
      setUrl(url)
      setHelmCharts(helmCharts)
      setCatalog(catalog)
    })
  }, [])

  // set the workload values based on the helm chart
  useEffect(() => {
    if (valuesData?.id) {
      setWorkloadValues(valuesData?.values)
      return
    }
    if (!catalog || !data?.chart?.helmChart) return
    const catalogItem = catalog.find((item: any) => item.name === data.chart.helmChart)
    if (!catalogItem) return
    setWorkloadValues(catalogItem.values)
    setData((prev) => ({
      ...prev,
      chart: {
        ...prev.chart,
        helmChartVersion: catalogItem.chartVersion,
        helmChartDescription: catalogItem.chartDescription,
      },
    }))
  }, [data?.chart?.helmChart, catalog])

  const handleCreateUpdateWorkload = async () => {
    let res
    if (workloadId) {
      dispatch(setError(undefined))
      res = await updateWorkload({ teamId, workloadId, body: data })
      res = await updateWorkloadValues({ teamId, workloadId, body: { values: workloadValues } })
    } else {
      res = await createWorkload({ teamId, body: data })
      res = await updateWorkloadValues({ teamId, workloadId: res.data.id, body: { values: workloadValues } })
    }
    if (res.error) return
    history.push(`/teams/${teamId}/workloads`)
  }

  const helmChart: string = data?.chart?.helmChart || helmCharts?.[0]
  const helmChartVersion: string = data?.chart?.helmChartVersion
  const helmChartDescription: string = data?.chart?.helmChartDescription
  const schema = getWorkloadSchema(url, helmCharts, helmChart, helmChartVersion, helmChartDescription)
  const uiSchema = getWorkloadUiSchema(user, teamId)

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <HeaderTitle title={title} resourceType={resourceType} />
        {workloadId && (
          <DeleteButton
            onDelete={() => deleteWorkload({ teamId, workloadId })}
            resourceName={workload?.name}
            resourceType='workload'
            data-cy='button-delete-workload'
          />
        )}
      </Box>

      <Form
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onChange={setData}
        disabled={!appsEnabled.argocd || !!workload?.id}
        resourceType='Workload'
        children
        hideHelp
        {...other}
      />

      <WorkloadValues
        editable
        hideTitle
        workloadValues={workloadValues}
        setWorkloadValues={setWorkloadValues}
        helmChart={helmChart}
      />

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button variant='contained' onClick={handleCreateUpdateWorkload}>
          Submit
        </Button>
      </Box>
    </Box>
  )
}
