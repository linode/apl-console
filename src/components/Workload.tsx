/* eslint-disable react/button-has-type */
import { Box, Button, CircularProgress } from '@mui/material'
import { cloneDeep, set } from 'lodash'
import { CrudProps } from 'pages/types'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, useCustomWorkloadValuesMutation, useGetWorkloadValuesQuery } from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useSession } from 'providers/Session'
import { getDomain } from 'layouts/Shell'
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
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  workload?: any
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
  const [data, setData]: any = useState(workload)
  const { data: WLvaluesData } = useGetWorkloadValuesQuery({ teamId, workloadId }, { skip: !workloadId })
  const [getCustomWorkloadValues] = useCustomWorkloadValuesMutation()
  const [valuesData, setValuesData]: any = useState(WLvaluesData)
  const [helmCharts, setHelmCharts] = useState<any[]>([])
  const [catalog, setCatalog] = useState<any[]>([])
  const [show, setShow] = useState(false)
  const [url, setUrl] = useState(workload?.chart?.helmChartCatalog)
  console.log('url', url)
  const resourceType = 'Workload'
  let title: string
  if (workloadId) title = t('FORM_TITLE_TEAM', { model: t(resourceType), name: workload.name, teamId: oboTeamId })
  if (!workloadId) title = t('FORM_TITLE_TEAM_NEW', { model: t(resourceType), teamId: oboTeamId })

  // eslint-disable-next-line no-promise-executor-return
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    if (!url) {
      const hostname = window.location.hostname
      const domain = getDomain(hostname)
      setUrl(`https://gitea.${domain}/otomi/charts.git`)
      if (domain === 'localhost') setUrl('https://github.com/redkubes/otomi-charts.git')
    }
  }, [])

  useEffect(() => {
    if (url) {
      getCustomWorkloadValues({ body: { url } }).then((res: any) => {
        const { helmCharts, catalog } = res.data
        setHelmCharts(helmCharts)
        setCatalog(catalog)
      })
    }
  }, [url])

  useEffect(() => {
    setShow(false)
    const catalogItem = catalog?.find((item: any) => item.name === data?.chart?.helmChart)
    setValuesData(WLvaluesData || catalogItem)
    if (catalogItem) wait(500).then(() => setShow(true))
  }, [data?.chart?.helmChart, helmCharts, catalog])

  const handleCreateUpdateWorkload = async () => {
    const workload = data
    const workloadValues = {
      values: valuesData.values,
    }
    let res
    if (workloadId) {
      dispatch(setError(undefined))
      res = await updateWorkload({ teamId, workloadId, body: workload })
      res = await updateWorkloadValues({ teamId, workloadId, body: workloadValues })
    } else {
      res = await createWorkload({ teamId, body: workload })
      res = await updateWorkloadValues({ teamId, workloadId: res.data.id, body: workloadValues })
    }
    if (res.error) return
    history.push(`/teams/${teamId}/workloads`)
  }

  const helmChart = data?.chart?.helmChart || helmCharts?.[0]
  const helmChartVersion = data?.chart?.helmChartVersion || valuesData?.chartVersion
  const helmChartDescription = data?.chart?.helmChartDescription || valuesData?.chartDescription

  const schema = getWorkloadSchema(url, helmCharts, helmChart, helmChartVersion, helmChartDescription)
  const uiSchema = getWorkloadUiSchema(user, teamId)

  console.log('workload', workload)
  console.log('workloadValues', valuesData)

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

      {show ? (
        <WorkloadValues editable hideTitle workloadValues={valuesData} setWorkloadValues={setValuesData} />
      ) : (
        <CircularProgress sx={{ mb: '1rem' }} />
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button variant='contained' onClick={handleCreateUpdateWorkload}>
          Submit
        </Button>
      </Box>
    </Box>
  )
}
