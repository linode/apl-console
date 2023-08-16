/* eslint-disable react/button-has-type */
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material'
import { omit } from 'lodash'
import { CrudProps } from 'pages/types'
import React, { useEffect, useState } from 'react'
import { GetWorkloadApiResponse, useGetWorkloadValuesQuery } from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useSession } from 'providers/Session'
import WorkloadValues from './WorkloadValues'
import HeaderTitle from './HeaderTitle'
import WorkloadDefine from './WorkloadDefine'
import WorkloadEssentialValues from './WorkloadEssentialValues'
import DeleteButton from './DeleteButton'

const radioValues = [
  { value: 'deployment', label: 'Regular application (deployment chart)' },
  { value: 'ksvc', label: 'Function as a Service (ksvc chart)' },
  { value: 'custom', label: 'Bring your own Helm chart' },
]

const steps = {
  deployment: ['Define workload name', 'Define chart values', 'Review and adjust values'],
  ksvc: ['Define workload name', 'Define chart values', 'Review and adjust values'],
  custom: ['Define workload name', 'Review and adjust values'],
}

interface Props extends CrudProps {
  teamId: string
  workload?: GetWorkloadApiResponse
  workloadId?: string
  createWorkload: any
  updateWorkload: any
  editWorkloadValues: any
  updateWorkloadValues: any
  deleteWorkload: any
}

export default function ({
  teamId,
  workload,
  workloadId,
  createWorkload,
  updateWorkload,
  editWorkloadValues,
  updateWorkloadValues,
  deleteWorkload,
  ...other
}: Props): React.ReactElement {
  const history = useHistory()
  const { t } = useTranslation()
  const { oboTeamId } = useSession()
  const [activeStep, setActiveStep] = useState(0)
  const [data, setData]: any = useState(workload)
  const { data: WLvaluesData } = useGetWorkloadValuesQuery({ teamId, workloadId }, { skip: !workloadId })
  const [valuesData, setValuesData]: any = useState(WLvaluesData)
  const [selectedChart, setSelectedChart] = useState(workload?.selectedChart || (workloadId && 'custom') || '')
  const resourceType = activeStep ? 'Workload values' : 'Workload'
  let title: string
  if (workloadId) title = t('FORM_TITLE_TEAM', { model: t(resourceType), name: workload.name, teamId: oboTeamId })
  if (!workloadId) title = t('FORM_TITLE_TEAM_NEW', { model: t(resourceType), teamId: oboTeamId })

  useEffect(() => {
    setValuesData(WLvaluesData)
  }, [WLvaluesData])

  const setNextStep = () => setActiveStep((prev) => prev + 1)
  const setPreviousStep = () => setActiveStep((prev) => prev - 1)

  const handleCreateUpdateWorkload = async () => {
    const body =
      selectedChart === 'custom'
        ? data
        : {
            name: data?.name,
            url: 'https://gitea.dev.d2-otomi.net/otomi/charts.git',
            path: selectedChart,
            revision: 'HEAD',
          }
    if (workloadId) {
      await updateWorkload({
        teamId,
        workloadId,
        body: { ...body, selectedChart },
      })
      setNextStep()
      return
    }
    createWorkload({
      teamId,
      body: { ...body, selectedChart },
    }).then((res: any) => {
      if (res.error) return
      setNextStep()
    })
  }

  const handleUpdateWorkloadValues = async () => {
    const values =
      selectedChart === 'custom' ? valuesData?.values : { ...valuesData?.values, fullnameOverride: workload?.name }
    const res = await updateWorkloadValues({
      teamId,
      workloadId,
      body: {
        id: workloadId,
        values: omit(values, ['id', 'teamId', 'selectedChart']),
      } as any,
    })
    setValuesData({ ...res.data, name: workload?.name, teamId })
    setNextStep()
  }

  const handleEditWorkloadValues = async () => {
    await editWorkloadValues({
      teamId,
      workloadId,
      body: {
        id: workloadId,
        values: omit(valuesData.values, ['id', 'teamId', 'selectedChart']),
      } as any,
    })
    history.push(`/teams/${teamId}/workloads`)
  }

  const handleNext = async () => {
    if (activeStep === 0) await handleCreateUpdateWorkload()
    if (activeStep === 1 && selectedChart !== 'custom') await handleUpdateWorkloadValues()
    else if (activeStep === steps[selectedChart].length - 1) await handleEditWorkloadValues()
  }

  const isDisabled = () => {
    if (activeStep === 0) return !data?.name || (selectedChart === 'custom' && !data?.url)
    if (activeStep === 1) {
      const values = valuesData?.values
      return !values?.image?.repository || !values?.image?.tag
    }
    return false
  }

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
      {!selectedChart && !workloadId ? (
        <FormControl sx={{ mt: 1 }}>
          <FormLabel sx={{ mb: 1 }}>Choose one of the following helm charts.</FormLabel>
          <RadioGroup onChange={(e) => setSelectedChart(e.target.value)} value={selectedChart}>
            {radioValues.map(({ value, label }: { value: string; label: string }) => (
              <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
            ))}
          </RadioGroup>
        </FormControl>
      ) : (
        <>
          <Stepper activeStep={activeStep} sx={{ mt: 1, mb: 1 }}>
            {steps[selectedChart].map((step: string) => {
              return (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              )
            })}
          </Stepper>

          {activeStep === 0 && (
            <WorkloadDefine
              workload={workload}
              teamId={teamId}
              data={data}
              setData={setData}
              selectedChart={selectedChart}
              {...other}
            />
          )}

          {activeStep === 1 && selectedChart !== 'custom' && (
            <WorkloadEssentialValues
              teamId={teamId}
              valuesData={valuesData}
              setValuesData={setValuesData}
              selectedChart={selectedChart}
              {...other}
            />
          )}

          {activeStep === steps[selectedChart].length - 1 && (
            <WorkloadValues editable hideTitle workloadValues={valuesData} setWorkloadValues={setValuesData} />
          )}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              variant='contained'
              color='inherit'
              disabled={activeStep === 0}
              onClick={setPreviousStep}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps[selectedChart].length - 1 ? (
              <Button variant='contained' onClick={() => handleNext()}>
                Submit
              </Button>
            ) : (
              <Button variant='contained' disabled={isDisabled()} onClick={() => handleNext()}>
                Next
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
