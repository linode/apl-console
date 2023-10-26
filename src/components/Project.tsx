import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, omit } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import {
  GetSessionApiResponse,
  useGetSecretsQuery,
  useGetSettingsQuery,
  useGetTeamK8SServicesQuery,
  useWorkloadCatalogMutation,
} from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getIngressClassNames } from 'pages/Service'
import { getDomain } from 'layouts/Shell'
import { useAppDispatch } from 'redux/hooks'
import { setError } from 'redux/reducers'
import Form from './rjsf/Form'
import { getHost, getServiceSchema, getServiceUiSchema, updateIngressField } from './Service'
import WorkloadValues from './WorkloadValues'
import { getWorkloadSchema, getWorkloadUiSchema } from './Workload'
import { getBuildSchema, getBuildUiSchema } from './Build'
import DeleteButton from './DeleteButton'

export const getProjectSchema = (): any => {
  const schema = cloneDeep(getSpec().components.schemas.Project)
  return schema
}

export const getProjectUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    build: { 'ui:widget': 'hidden' },
    workload: { 'ui:widget': 'hidden' },
    workloadValues: { 'ui:widget': 'hidden' },
    service: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'build')

  return uiSchema
}

const projectSteps = ['Create Project', 'Create Build', 'Create Workload', 'Create Service']

const pathValues = [
  { value: 'createBuild', label: 'Create build from source' },
  { value: 'useExisting', label: 'Use existing image' },
]

interface Props extends CrudProps {
  teamId: string
  create: any
  update: any
  projectId?: string
  project?: any
  onDelete?: any
}

export default function ({
  teamId,
  create,
  update,
  projectId,
  project,
  onDelete,
  ...other
}: Props): React.ReactElement {
  const history = useHistory()
  const { t } = useTranslation()
  const { appsEnabled, settings, user } = useSession()
  const dispatch = useAppDispatch()
  const [activeStep, setActiveStep] = useState(0)
  const [selectedPath, setSelectedPath] = useState('createBuild')
  const [workloadValues, setWorkloadValues] = useState<any>(project?.workloadValues?.values || {})
  const [getWorkloadCatalog] = useWorkloadCatalogMutation()
  const [helmCharts, setHelmCharts] = useState<string[]>([])
  const [catalog, setCatalog] = useState<any[]>([])
  const [data, setData] = useState<any>(project || {})
  const formData = cloneDeep(data)

  // set the helm chart catalog url based on the domain
  useEffect(() => {
    if (data?.workload?.chart?.helmChartCatalog) return
    const hostname = window.location.hostname
    const domain = getDomain(hostname)
    const defaultUrl =
      domain === 'localhost'
        ? 'https://github.com/redkubes/otomi-charts.git'
        : `https://gitea.${domain}/otomi/charts.git`
    setData((prev) => ({
      ...prev,
      workload: {
        ...prev.workload,
        chart: {
          ...prev.chart,
          helmChartCatalog: defaultUrl,
        },
      },
    }))
  }, [])

  // get the helm charts and catalog based on the helm chart catalog url
  useEffect(() => {
    if (!data?.workload?.chart?.helmChartCatalog) return
    getWorkloadCatalog({ body: { url: data?.workload?.chart?.helmChartCatalog, sub: user.sub } }).then((res: any) => {
      const { helmCharts, catalog }: { helmCharts: string[]; catalog: any[] } = res.data
      setHelmCharts(helmCharts)
      setCatalog(catalog)
    })
  }, [data?.workload?.chart?.helmChartCatalog])

  // set the workload values based on the helm chart
  useEffect(() => {
    if (project?.workloadValues?.id) {
      setWorkloadValues(project?.workloadValues?.values)
      return
    }
    if (!catalog || !formData?.workload?.chart?.helmChart) return
    const catalogItem = catalog.find((item: any) => item.name === formData.workload.chart.helmChart)
    if (!catalogItem) return
    setWorkloadValues(catalogItem.values)
    setData((prev) => ({
      ...prev,
      workload: {
        ...prev.workload,
        chart: {
          ...prev.chart,
          helmChartVersion: catalogItem.chartVersion,
          helmChartDescription: catalogItem.chartDescription,
        },
      },
    }))
  }, [formData?.workload?.chart?.helmChart, catalog])

  useEffect(() => {
    setData(project)
  }, [project])

  const projectSchema = getProjectSchema()
  const projectUiSchema = getProjectUiSchema(user, teamId)

  const buildSchema = getBuildSchema(teamId)
  const buildUiSchema = getBuildUiSchema(user, teamId)
  buildUiSchema.name = { 'ui:widget': 'hidden' }

  const helmChartCatalog: string = data?.workload?.chart?.helmChartCatalog
  const helmChart: string = data?.workload?.chart?.helmChart || helmCharts?.[0]
  const helmChartVersion: string = data?.workload?.chart?.helmChartVersion
  const helmChartDescription: string = data?.workload?.chart?.helmChartDescription

  const workloadSchema = getWorkloadSchema(
    helmChartCatalog,
    helmCharts,
    helmChart,
    helmChartVersion,
    helmChartDescription,
  )
  const workloadUiSchema = getWorkloadUiSchema(user, teamId)
  workloadUiSchema.name = { 'ui:widget': 'hidden' }

  const { data: k8sServices } = useGetTeamK8SServicesQuery({ teamId })
  const { data: secrets } = useGetSecretsQuery({ teamId })
  const { data: ingressSettings } = useGetSettingsQuery({ ids: ['ingress'] })
  const ingressClassNames = getIngressClassNames(ingressSettings)
  const serviceSchema = getServiceSchema(
    appsEnabled,
    settings,
    formData?.service,
    teamId,
    secrets,
    k8sServices,
    ingressClassNames,
  )
  const serviceUiSchema = getServiceUiSchema(appsEnabled, formData?.service, user, teamId)
  serviceUiSchema.name = { 'ui:widget': 'hidden' }

  const teamSubdomain = getHost(formData?.service?.name, teamId)
  const defaultSubdomain = teamSubdomain
  updateIngressField(formData?.service, defaultSubdomain)

  const setNextStep = () => setActiveStep((prev) => prev + 1)
  const setPreviousStep = () => setActiveStep((prev) => prev - 1)

  const handleCreateProject = () => {
    const { name } = formData
    if (formData?.id) {
      if (!formData.service.name) setData({ ...formData, service: { name } })
      if (selectedPath === 'useExisting') {
        delete formData.build
        setActiveStep(2)
        return
      }
      setNextStep()
      return
    }
    create({ teamId, body: omit(formData, ['id', 'build', 'workload', 'workloadValues', 'service']) }).then(
      (res: any) => {
        if (res.error) return
        if (selectedPath === 'useExisting') setActiveStep(2)
        else setNextStep()
      },
    )
  }

  const handleUpdateProject = async () => {
    dispatch(setError(undefined))
    const { name, build, workload, service } = formData
    const res = await update({
      teamId,
      projectId,
      body: {
        ...formData,
        build: { ...build, name },
        workload: { ...workload, name },
        workloadValues: { ...formData.workloadValues, values: workloadValues },
        service: { ...service, name },
      },
    })
    if (res.error) return
    history.push(`/projects`)
  }

  const handleDeleteProject = () => {
    onDelete({ teamId, projectId })
    history.push(`/projects`)
  }

  const handleNext = async () => {
    if (activeStep === 0) handleCreateProject()
    if (activeStep === 1 || activeStep === 2) setNextStep()
    if (activeStep === 3) await handleUpdateProject()
  }

  const isDisabled = () => {
    if (activeStep === 0) return !formData?.name
    if (activeStep === 1) return !formData?.build?.mode?.docker?.repoUrl && !formData?.build?.mode?.buildpacks?.repoUrl
    if (activeStep === 2) return !formData?.workload?.chart?.helmChart
    return false
  }

  return (
    <Box>
      <Box sx={{ position: 'absolute', right: '24px' }}>
        {projectId && (
          <DeleteButton
            onDelete={handleDeleteProject}
            resourceName={project?.name}
            resourceType='project'
            data-cy='button-delete-project'
            customContent={t('DELETE_PROJECT_WARNING')}
          />
        )}
      </Box>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {projectSteps.map((step, index) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
            <StepContent>
              {activeStep === 0 && (
                <Box>
                  <Form
                    schema={projectSchema}
                    uiSchema={projectUiSchema}
                    data={formData}
                    onChange={(data: any) => setData({ ...formData, ...data })}
                    disabled={!appsEnabled.tekton || !!formData?.id}
                    resourceType='Project'
                    {...other}
                    children
                    hideHelp
                  />
                  <FormControl sx={{ my: 2 }}>
                    <RadioGroup onChange={(e) => setSelectedPath(e.target.value)} value={selectedPath}>
                      {pathValues.map(({ value, label }: { value: string; label: string }) => (
                        <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              {activeStep === 1 && (
                <Form
                  schema={buildSchema}
                  uiSchema={buildUiSchema}
                  data={formData.build}
                  onChange={(data: any) => setData({ ...formData, build: data })}
                  disabled={!appsEnabled.tekton}
                  resourceType='Build'
                  {...other}
                  children
                  hideHelp
                />
              )}

              {activeStep === 2 && (
                <Box sx={{ width: '100%', mb: '1rem' }}>
                  <Form
                    schema={workloadSchema}
                    uiSchema={workloadUiSchema}
                    data={formData.workload}
                    onChange={(data: any) => setData({ ...formData, workload: data })}
                    disabled={!appsEnabled.argocd || !!project?.workload?.id}
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
                </Box>
              )}

              {activeStep === 3 && (
                <Form
                  schema={serviceSchema}
                  uiSchema={serviceUiSchema}
                  data={formData.service}
                  onChange={(data: any) => setData({ ...formData, service: data })}
                  resourceType='Service'
                  children
                  hideHelp
                  {...other}
                />
              )}

              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button variant='contained' color='inherit' disabled={index === 0} onClick={setPreviousStep}>
                  Back
                </Button>
                <Button variant='contained' onClick={handleNext} disabled={isDisabled()}>
                  {index === projectSteps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
