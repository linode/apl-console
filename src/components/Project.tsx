import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import { GetSessionApiResponse, useGetSecretsQuery, useGetTeamK8SServicesQuery } from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Form from './rjsf/Form'
import { getServiceSchema, getServiceUiSchema } from './Service'
import WorkloadEssentialValues from './WorkloadEssentialValues'
import WorkloadValues from './WorkloadValues'
import { getWorkloadSchema, getWorkloadUiSchema } from './WorkloadDefine'
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
    data: { 'ui:widget': 'hidden' },
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

  const projectSchema = getProjectSchema(teamId)
  const projectUiSchema = getProjectUiSchema(user, teamId)

  const buildSchema = getBuildSchema(teamId)
  const buildUiSchema = getBuildUiSchema(user, teamId)
  buildUiSchema.name = { 'ui:widget': 'hidden' }

  const workloadSchema = getWorkloadSchema()
  if (data?.workload?.selectedChart !== 'custom') workloadSchema.required.push('url')
  const workloadUiSchema = getWorkloadUiSchema(user, teamId)
  workloadUiSchema.custom.name = { 'ui:widget': 'hidden' }

  const { data: k8sServices } = useGetTeamK8SServicesQuery({ teamId })
  const { data: secrets } = useGetSecretsQuery({ teamId })
  const serviceSchema = getServiceSchema(appsEnabled, settings, data?.service, teamId, secrets, k8sServices)
  const serviceUiSchema = getServiceUiSchema(appsEnabled, data?.service, user, teamId)
  serviceUiSchema.name = { 'ui:widget': 'hidden' }

  const handleCreateProject = () => {
    if (data?.id) {
      setActiveStep((prev) => prev + 1)
      return
    }
    create({ teamId, body: data }).then((res: any) => {
      if (res.error) return
      setData(res.data)
      if (selectedPath === 'useExisting') setActiveStep(2)
      else setActiveStep((prev) => prev + 1)
    })
  }

  const handleUpdateProject = async () => {
    await update({
      teamId,
      projectId,
      body: { ...data, service: data.service },
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
      const registry = `harbor.${domainSuffix}/team-${teamId}/${data?.name}`
      setValuesData({ values: { image: { repository: registry, tag: data.build.tag } } })
      setActiveStep((prev) => prev + 1)
    }
    if (activeStep === 3) await handleUpdateProject()
  }

  const handleSelectChart = (e: any) => {
    const chart = e.target.value
    if (chart === 'custom') setData({ ...data, workload: { ...data?.workload, name: data.name, selectedChart: chart } })
    setSelectedChart(chart)
  }

  const handleNextWL = () => {
    const body =
      selectedChart === 'custom'
        ? { ...data.workload, name: data?.name }
        : {
            name: data?.name,
            url: 'https://github.com/redkubes/otomi-charts.git',
            path: selectedChart,
            revision: 'v1.0.1',
          }

    if (selectedChart === 'custom' && activeStepWL === 0) {
      setValuesData({})
      setData({
        ...data,
        workload: { ...body, selectedChart },
      })
      setActiveStepWL((prev) => prev + 1)
      return
    }

    if (selectedChart === 'custom' && activeStepWL === 1) {
      setValuesData({ values: valuesData?.values })
      setData({
        ...data,
        workload: { ...data?.workload, ...body, selectedChart },
        workloadValues: { ...data.workloadValues, values: valuesData?.values },
      })
      setActiveStep((prev) => prev + 1)
      return
    }

    let { containerPorts } = valuesData.values
    if (selectedChart === 'ksvc' && containerPorts[0].name !== 'http1')
      containerPorts = [{ ...containerPorts[0], name: 'http1' }]
    const values = { fullnameOverride: data?.name, ...valuesData?.values, containerPorts }
    setValuesData({ values })

    setData({
      ...data,
      workload: { ...data?.workload, ...body, selectedChart },
      workloadValues: { ...data.workloadValues, values },
    })
    if (activeStepWL === workloadSteps[selectedChart].length - 1) setActiveStep((prev) => prev + 1)
    else setActiveStepWL((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleBackWL = () => {
    if (activeStepWL === 0) setActiveStep((prev) => prev - 1)
    else setActiveStepWL((prev) => prev - 1)
  }

  const isDisabled = () => {
    if (activeStep === 0) return !data?.name
    if (activeStep === 1) return !data?.build?.mode?.docker?.repoUrl && !data?.build?.mode?.buildpacks?.repoUrl
    if (activeStep === 3 && teamId === 'admin') return !data?.service?.namespace
    if (activeStepWL === 0) return selectedChart === 'custom' && !data?.workload?.url
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
                    data={data}
                    onChange={(formData: any) => setData({ ...data, ...formData })}
                    disabled={!appsEnabled.tekton || !!data?.id}
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
                  data={data.build}
                  onChange={(formData: any) => setData({ ...data, build: formData })}
                  disabled={!appsEnabled.tekton}
                  resourceType='Build'
                  {...other}
                  children
                  hideHelp
                />
              )}

              {activeStep === 2 && (
                <Box sx={{ width: '100%' }}>
                  {!selectedChart && !data?.workload?.id ? (
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
                          uiSchema={
                            selectedChart === 'deployment' || selectedChart === 'ksvc'
                              ? workloadUiSchema.preDefined
                              : workloadUiSchema.custom
                          }
                          data={data.workload}
                          onChange={(formData: any) => setData({ ...data, workload: formData })}
                          disabled={
                            !appsEnabled.argocd || (data?.workload?.selectedChart !== 'custom' && !!data?.workload?.id)
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
                          onClick={handleBackWL}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {activeStepWL === workloadSteps[selectedChart].length - 1 ? (
                          <Button variant='contained' onClick={handleNextWL}>
                            Continue
                          </Button>
                        ) : (
                          <Button variant='contained' disabled={isDisabled()} onClick={handleNextWL}>
                            Next
                          </Button>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              )}

              {activeStep === 3 && (
                <Form
                  schema={serviceSchema}
                  uiSchema={serviceUiSchema}
                  data={data.service}
                  onChange={(formData: any) => setData({ ...data, service: formData })}
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
                  <Button variant='contained' color='inherit' disabled={index === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant='contained' onClick={handleNext} disabled={isDisabled()}>
                    {index === projectSteps.length - 1 ? 'Submit' : 'Continue'}
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
