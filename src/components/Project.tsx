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
} from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getIngressClassNames } from 'pages/Service'
import Form from './rjsf/Form'
import { getHost, getServiceSchema, getServiceUiSchema, updateIngressField } from './Service'
import WorkloadEssentialValues from './WorkloadEssentialValues'
import WorkloadValues from './WorkloadValues'
import { getWorkloadSchema, getWorkloadUiSchema, isGiteaURL } from './WorkloadDefine'
import { getBuildSchema, getBuildUiSchema } from './Build'
import DeleteButton from './DeleteButton'

export const getProjectSchema = (teamId: string): any => {
  const schema = cloneDeep(getSpec().components.schemas.Project)
  return schema
}

export const getProjectUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
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

const chartValues = [
  { value: 'deployment', label: 'Regular application (deployment chart)' },
  { value: 'ksvc', label: 'Function as a Service (ksvc chart)' },
  { value: 'custom', label: 'Bring your own Helm chart' },
]

const workloadSteps = {
  deployment: ['Define chart values', 'Review and adjust values'],
  ksvc: ['Define chart values', 'Review and adjust values'],
  custom: ['Define workload', 'Review and adjust values'],
}

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
  const {
    cluster: { domainSuffix },
  } = settings
  const [activeStep, setActiveStep] = useState(0)
  const [activeStepWL, setActiveStepWL] = useState(0)
  const [selectedPath, setSelectedPath] = useState('createBuild')
  const [selectedChart, setSelectedChart] = useState(project?.workload?.selectedChart || '')
  const [valuesData, setValuesData]: any = useState(project?.workloadValues || {})
  const [data, setData] = useState<any>(project || {})

  useEffect(() => {
    setData(project)
  }, [project])

  const formData = cloneDeep(data)

  const projectSchema = getProjectSchema(teamId)
  const projectUiSchema = getProjectUiSchema(user, teamId)

  const buildSchema = getBuildSchema(teamId)
  const buildUiSchema = getBuildUiSchema(user, teamId)
  buildUiSchema.name = { 'ui:widget': 'hidden' }

  const workloadSchema = getWorkloadSchema()
  if (formData?.workload?.selectedChart !== 'custom') workloadSchema.required.push('url')
  const isGitea = isGiteaURL(formData?.workload?.url)
  const workloadUiSchema = getWorkloadUiSchema(user, teamId, isGitea)
  workloadUiSchema.custom.name = { 'ui:widget': 'hidden' }

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

  const setNextStepWL = () => setActiveStepWL((prev) => prev + 1)
  const setPreviousStepWL = () => {
    if (activeStepWL === 0) {
      setSelectedChart('')
      setPreviousStep()
    } else setActiveStepWL((prev) => prev - 1)
  }

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
        setData({ ...res.data, build: { name }, service: { name } })
        if (selectedPath === 'useExisting') setActiveStep(2)
        else setNextStep()
      },
    )
  }

  const handleUpdateProject = async () => {
    await update({
      teamId,
      projectId,
      body: { ...formData, service: formData.service },
    })
    history.push(`/projects`)
  }

  const handleDeleteProject = () => {
    onDelete({ teamId, projectId })
    history.push(`/projects`)
  }

  const handleNext = async () => {
    if (activeStep === 0) handleCreateProject()
    if (activeStep === 1) {
      const registry = `harbor.${domainSuffix}/team-${teamId}/${formData?.name}`
      setValuesData({ values: { image: { repository: registry, tag: formData.build.tag } } })
      setNextStep()
    }
    if (activeStep === 3) await handleUpdateProject()
  }

  const handleSelectChart = (e: any) => {
    const chart = e.target.value
    if (chart === 'custom')
      setData({ ...formData, workload: { ...formData?.workload, name: formData.name, selectedChart: chart } })
    setSelectedChart(chart)
  }

  const handleNextWL = () => {
    const body =
      selectedChart === 'custom'
        ? { ...formData.workload, name: formData?.name }
        : {
            name: formData?.name,
            url: 'https://github.com/redkubes/otomi-charts.git',
            path: selectedChart,
            revision: 'HEAD',
          }

    if (selectedChart === 'custom' && activeStepWL === 0) {
      setValuesData({})
      setData({
        ...formData,
        workload: { ...body, selectedChart },
      })
      setNextStepWL()
      return
    }

    if (selectedChart === 'custom' && activeStepWL === 1) {
      setValuesData({ values: valuesData?.values })
      setData({
        ...formData,
        workload: { ...formData?.workload, ...body, selectedChart },
        workloadValues: { ...formData.workloadValues, values: valuesData?.values },
      })
      setNextStep()
      return
    }

    let { containerPorts } = valuesData.values
    if (selectedChart === 'ksvc' && containerPorts[0].name !== 'http1')
      containerPorts = [{ ...containerPorts[0], name: 'http1' }]
    const values = { fullnameOverride: formData?.name, ...valuesData?.values, containerPorts }
    setValuesData({ values })

    setData({
      ...formData,
      workload: { ...formData?.workload, ...body, selectedChart },
      workloadValues: { ...formData.workloadValues, values },
    })
    if (activeStepWL === workloadSteps[selectedChart].length - 1) setNextStep()
    else setNextStepWL()
  }

  const isDisabled = () => {
    if (activeStep === 0) return !formData?.name
    if (activeStep === 1) return !formData?.build?.mode?.docker?.repoUrl && !formData?.build?.mode?.buildpacks?.repoUrl
    if (activeStepWL === 0) return selectedChart === 'custom' && !formData?.workload?.url
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
                <Box sx={{ width: '100%' }}>
                  {!selectedChart && !formData?.workload?.id ? (
                    <FormControl sx={{ mt: 1 }}>
                      <FormLabel sx={{ mb: 1 }}>Choose one of the following helm charts.</FormLabel>
                      <RadioGroup onChange={(e) => handleSelectChart(e)} value={selectedChart}>
                        {chartValues.map(({ value, label }: { value: string; label: string }) => (
                          <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    <>
                      <Stepper activeStep={activeStepWL} sx={{ mt: 1, mb: 1 }}>
                        {workloadSteps[selectedChart].map((step: string) => {
                          return (
                            <Step key={step}>
                              <StepLabel>{step}</StepLabel>
                            </Step>
                          )
                        })}
                      </Stepper>

                      {activeStepWL === 0 && selectedChart === 'custom' && (
                        <Form
                          schema={workloadSchema}
                          uiSchema={workloadUiSchema.custom}
                          data={formData.workload}
                          onChange={(data: any) => setData({ ...formData, workload: data })}
                          disabled={
                            !appsEnabled.argocd ||
                            (formData?.workload?.selectedChart !== 'custom' && !!formData?.workload?.id)
                          }
                          resourceType='Workload'
                          children
                          hideHelp
                          {...other}
                        />
                      )}

                      {activeStepWL === 0 && selectedChart !== 'custom' && (
                        <WorkloadEssentialValues
                          teamId={teamId}
                          valuesData={valuesData}
                          setValuesData={setValuesData}
                          selectedChart={selectedChart}
                          {...other}
                        />
                      )}

                      {activeStepWL === workloadSteps[selectedChart].length - 1 && (
                        <WorkloadValues
                          editable
                          hideTitle
                          workloadValues={valuesData}
                          setWorkloadValues={setValuesData}
                        />
                      )}

                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                          variant='contained'
                          color='inherit'
                          // disabled={activeStepWL === 0}
                          onClick={setPreviousStepWL}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button variant='contained' disabled={isDisabled()} onClick={handleNextWL}>
                          Next
                        </Button>
                      </Box>
                    </>
                  )}
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

              {activeStep !== 2 && (
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
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
