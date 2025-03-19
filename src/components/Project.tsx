import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep, omit, set } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import {
  GetSessionApiResponse,
  useGetSecretsFromK8SQuery,
  useGetTeamK8SServicesQuery,
  useWorkloadCatalogMutation,
} from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { FormControl, FormControlLabel, Link, Radio, RadioGroup, Tooltip, Typography, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'redux/hooks'
import { setError } from 'redux/reducers'
import { getDomain } from 'layouts/Shell'
import Form from './rjsf/Form'
import { getHost, getServiceSchema, getServiceUiSchema, updateIngressField } from './Service'
import WorkloadValues from './WorkloadValues'
import { getBuildSchema, getBuildUiSchema } from './Build'
import DeleteButton from './DeleteButton'
import Iconify from './Iconify'
import { getValuesDocLink } from './Catalog'

const getProjectSchema = (): any => {
  const schema = cloneDeep(getSpec().components.schemas.Project)
  return schema
}

const getProjectUiSchema = (user: GetSessionApiResponse['user'], teamId: string, isNameEditable: boolean): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:readonly': !isNameEditable },
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

const getWorkloadSchema = (
  url?: string,
  helmCharts?: string[],
  helmChart?: string,
  helmChartVersion?: string,
  helmChartDescription?: string,
  workloadName?: string,
): any => {
  const schema = cloneDeep(getSpec().components.schemas.Workload)
  const chartMetadata = {
    helmChartCatalog: {
      type: 'null',
      title: 'Helm chart catalog',
      default: url,
      listNotShort: true,
    },
    helmChart: {
      type: 'string',
      title: 'Helm chart',
      default: helmChart,
      listNotShort: true,
      ...(!workloadName && { enum: helmCharts }),
    },
    helmChartVersion: {
      type: 'null',
      title: 'Helm chart version',
      default: helmChartVersion,
    },
    helmChartDescription: {
      type: 'null',
      title: 'Helm chart description',
      default: helmChartDescription,
    },
  }
  set(schema, 'properties.chartMetadata.properties', chartMetadata)
  set(schema, 'properties.url.default', url)
  set(schema, 'properties.path.default', helmChart)
  return schema
}

const getWorkloadUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    icon: { 'ui:widget': 'hidden' },
    url: { 'ui:widget': 'hidden' },
    chartProvider: { 'ui:widget': 'hidden' },
    path: { 'ui:widget': 'hidden' },
    chart: { 'ui:widget': 'hidden' },
    revision: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    createNamespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    sidecarInject: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

const setImageUpdateStrategy = (strategy: any, repository: string) => {
  if (strategy.type === 'digest' || strategy.type === 'semver') {
    return {
      ...strategy,
      [strategy.type]: { ...strategy[strategy.type], imageRepository: repository },
    }
  }
  return strategy
}

const projectSteps = ['Create Project', 'Create Build', 'Create Workload', 'Create Service']

const pathValues = [
  { value: 'createBuild', label: 'Create build from source' },
  { value: 'useExisting', label: 'Use existing image' },
]

// ----------------------- styles ----------------------------

const StyledStepContent = styled(StepContent)`
  padding: 20px;
`

// -----------------------------------------------------------

interface Props extends CrudProps {
  teamId: string
  create: any
  update: any
  projectName?: string
  project?: any
  onDelete?: any
}

export default function ({
  teamId,
  create,
  update,
  projectName,
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
  const [url, setUrl] = useState<string>(project?.workload?.url)
  const [data, setData] = useState<any>(project || {})
  const formData = cloneDeep(data)
  const hostname = window.location.hostname
  const domain = getDomain(hostname)

  // get the helm charts and catalog based on the helm chart catalog url
  useEffect(() => {
    if (project?.workload?.id) return
    getWorkloadCatalog({ body: { url, sub: user.sub } }).then((res: any) => {
      const { url, helmCharts, catalog }: { url: string; helmCharts: string[]; catalog: any[] } = res.data
      setUrl(url)
      setHelmCharts(helmCharts)
      setCatalog(catalog)
    })
  }, [])

  // set the workload values based on the helm chart and manipulate the image update strategy
  useEffect(() => {
    if (activeStep !== 2) return
    if (project?.workloadValues?.id) {
      setWorkloadValues(project?.workloadValues?.values)
      return
    }
    if (!catalog || !formData?.workload?.path) return
    const catalogItem = catalog.find((item: any) => item.name === formData.workload.path)
    if (!catalogItem) return
    let values = catalogItem?.values
    let imageUpdateStrategy = formData?.workload?.imageUpdateStrategy
    if (selectedPath === 'createBuild') {
      const repository = `harbor.${domain}/team-${teamId}/${formData?.name}`
      values = values.replace('repository: ""', `repository: ${repository}`)
      values = values.replace('tag: ""', `tag: ${formData?.build?.tag}`)
      imageUpdateStrategy = setImageUpdateStrategy(imageUpdateStrategy, repository)
    }
    setWorkloadValues(values)
    setData((prev: any) => ({
      ...prev,
      workload: {
        ...prev.workload,
        path: data?.workload?.chartMetadata?.helmChart,
        chartMetadata: {
          ...prev.workload.chartMetadata,
          helmChartVersion: catalogItem.chartVersion,
          helmChartDescription: catalogItem.chartDescription,
        },
        imageUpdateStrategy,
      },
    }))
  }, [
    project?.workloadValues,
    formData?.workload?.path,
    formData?.workload?.chartMetadata?.helmChart,
    formData?.workload?.imageUpdateStrategy?.type,
    catalog,
    activeStep,
  ])

  useEffect(() => {
    setData(project)
  }, [project])

  const projectSchema = getProjectSchema()
  const projectUiSchema = getProjectUiSchema(user, teamId, !project?.name)

  const buildSchema = getBuildSchema(teamId)
  const buildUiSchema = getBuildUiSchema(user, teamId, formData?.build, !project?.build?.name)
  buildUiSchema.name = { 'ui:widget': 'hidden' }

  const helmChart: string = data?.workload?.chartMetadata?.helmChart || data?.workload?.path || helmCharts?.[0]
  const helmChartVersion: string = data?.workload?.chartMetadata?.helmChartVersion
  const helmChartDescription: string = data?.workload?.chartMetadata?.helmChartDescription
  const workloadSchema = getWorkloadSchema(
    url,
    helmCharts,
    helmChart,
    helmChartVersion,
    helmChartDescription,
    data?.workload?.id,
  )
  const workloadUiSchema = getWorkloadUiSchema(user, teamId)
  workloadUiSchema.name = { 'ui:widget': 'hidden' }
  const rerenderValues = `${helmChart}${formData?.workload?.imageUpdateStrategy?.type}`

  const { data: k8sServices } = useGetTeamK8SServicesQuery({ teamId })
  const { data: secrets } = useGetSecretsFromK8SQuery({ teamId })
  const serviceSchema = getServiceSchema(appsEnabled, settings, formData?.service, teamId, secrets, k8sServices)
  const serviceUiSchema = getServiceUiSchema(appsEnabled, formData?.service, user, teamId, !formData?.service?.name)
  serviceUiSchema.name = { 'ui:widget': 'hidden' }

  const teamSubdomain = getHost(formData?.name, teamId)
  const defaultSubdomain = teamSubdomain
  updateIngressField(formData?.service, defaultSubdomain)

  const setNextStep = () => {
    setActiveStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }
  const setPreviousStep = () => {
    setActiveStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleCreateProject = () => {
    const { name } = formData
    if (projectName) {
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
        setData((prev: any) => ({ ...prev, id: res.data.id }))
        if (selectedPath === 'useExisting') setActiveStep(2)
        else setNextStep()
      },
    )
  }

  const handleUpdateProject = async () => {
    dispatch(setError(undefined))
    const { name, build, workload, service } = formData
    if (selectedPath === 'useExisting') delete formData.build
    const workloadBody = omit(workload, ['chartProvider', 'chart', 'revision'])
    const chartMetadata = omit(workload?.chartMetadata, ['helmChartCatalog', 'helmChart'])
    const body = {
      ...formData,
      ...(formData?.build && { build: { ...build, name } }),
      workload: {
        ...workloadBody,
        name,
        chartMetadata,
      },
      workloadValues: { ...formData.workloadValues, values: workloadValues },
      service: { ...service, name },
    }
    const res = await update({
      teamId,
      projectName,
      body,
    })
    if (res.error) return
    history.push(user.isPlatformAdmin ? `/projects` : `/teams/${teamId}/projects`)
  }

  const handleDeleteProject = () => {
    onDelete({ teamId, projectName })
    history.push(user.isPlatformAdmin ? `/projects` : `/teams/${teamId}/projects`)
  }

  const handleNext = async () => {
    if (activeStep === 0) handleCreateProject()
    if (activeStep === 1 || activeStep === 2) setNextStep()
    if (activeStep === 3) await handleUpdateProject()
  }

  const isDisabled = () => {
    if (activeStep === 0) return !formData?.name
    if (activeStep === 1) return !formData?.build?.mode?.docker?.repoUrl && !formData?.build?.mode?.buildpacks?.repoUrl
    if (activeStep === 2) return !formData?.workload?.path
    return false
  }

  return (
    <Box>
      <Box sx={{ position: 'absolute', right: '24px' }}>
        {projectName && (
          <DeleteButton
            onDelete={handleDeleteProject}
            resourceName={project?.name}
            resourceType='project'
            data-cy='button-delete-project'
            customContent={t('DELETE_PROJECT_WARNING')}
          />
        )}
      </Box>
      <Stepper sx={{ p: 2 }} activeStep={activeStep} orientation='vertical'>
        {projectSteps.map((step, index) => (
          <Step key={step}>
            <StepLabel>
              <Typography sx={{ fontWeight: 'bold' }}>{step}</Typography>
            </StepLabel>
            <StyledStepContent sx={{ padding: '20px' }}>
              {activeStep === 0 && (
                <Box>
                  <Form
                    schema={projectSchema}
                    uiSchema={projectUiSchema}
                    data={formData}
                    onChange={(data: any) => setData({ ...formData, ...data })}
                    disabled={!!formData?.id}
                    resourceType='Project'
                    {...other}
                    children
                    hideHelp
                    altColor
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
                  resourceType='Build'
                  {...other}
                  children
                  hideHelp
                  altColor
                />
              )}

              {activeStep === 2 && (
                <Box sx={{ width: '100%', mb: '1rem' }}>
                  <Form
                    schema={workloadSchema}
                    uiSchema={workloadUiSchema}
                    data={formData.workload}
                    onChange={(data: any) => setData({ ...formData, workload: data })}
                    disabled={!!project?.workload?.id}
                    resourceType='Workload'
                    children
                    hideHelp
                    altColor
                    {...other}
                  />

                  {formData.workload?.url && (
                    <Tooltip title={`Chart values file for ${formData.workload.path}`}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Iconify icon='majesticons:open' />
                        <Link
                          sx={{ ml: '8px', fontSize: '14px' }}
                          href={getValuesDocLink(formData.workload.url as string, formData.workload.path as string)}
                          target='_blank'
                          rel='noopener'
                        >
                          Chart values file
                        </Link>
                      </Box>
                    </Tooltip>
                  )}

                  <WorkloadValues
                    workloadValues={workloadValues}
                    setWorkloadValues={setWorkloadValues}
                    rerender={rerenderValues}
                    showComments={!project?.workload?.id}
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
                  altColor
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
            </StyledStepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
