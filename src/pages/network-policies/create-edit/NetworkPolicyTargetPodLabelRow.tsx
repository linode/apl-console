import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { GetAllAplWorkloadNamesApiResponse, useGetK8SWorkloadPodLabelsQuery } from 'redux/otomiApi'
import { getDefaultPodLabel, getInitialActiveWorkloadTarget } from './NetworkPolicyPodLabelMatchHelper'

interface Props {
  aplWorkloads: GetAllAplWorkloadNamesApiResponse
  teamId: string
  prefixName: string
  showBanner?: () => void
  isEditMode?: boolean
}

interface WorkloadOption {
  name: string
  namespace: string
}

interface FormValues {
  ruleType: {
    ingress: {
      toLabelName?: string
      toLabelValue?: string
    }
  }
  [key: string]: any
}

export default function NetworkPolicyTargetLabelRow({
  aplWorkloads,
  teamId,
  prefixName,
  showBanner,
  isEditMode,
}: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>()
  const [circuitBreaker, setCircuitBreaker] = useState(true)
  const [activeWorkload, setActiveWorkload] = useState<string>('')

  const toName = (watch(`${prefixName}.toLabelName`) as string) || ''
  const toValue = (watch(`${prefixName}.toLabelValue`) as string) || ''

  const targetValueError = errors.ruleType?.ingress?.toLabelName?.message

  // build workload options, but only those in this team's namespace
  const workloadOptions = useMemo<WorkloadOption[]>(() => {
    if (!aplWorkloads || !Array.isArray(aplWorkloads)) return []
    return aplWorkloads
      .map((w) => ({ name: w?.metadata?.name || '', namespace: w?.metadata?.namespace || '' }))
      .filter((o) => o.namespace === `team-${teamId}` && o.name)
      .sort((a, b) => a.namespace.localeCompare(b.namespace) || a.name.localeCompare(b.name))
  }, [aplWorkloads, teamId])

  // find the currently selected option object
  const selectedWorkloadOption = workloadOptions.find((o) => o.name === activeWorkload) || null

  // fetch the label→value map for that pod spec
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload, namespace: `team-${teamId}` },
    { skip: !activeWorkload },
  )
  const labelOptions = useMemo(() => Object.entries(podLabels ?? {}).map(([k, v]) => `${k}=${v}`), [podLabels])

  // Initial edit-mode circuitbreaker, prevent prepopulated fields from starting a rerender loop
  useEffect(() => {
    if (toValue && circuitBreaker) {
      setCircuitBreaker(false)
      if (isEditMode && aplWorkloads) {
        const initialActiveWorkload = getInitialActiveWorkloadTarget(toValue, aplWorkloads)
        if (initialActiveWorkload === 'unknown' || initialActiveWorkload === 'multiple') showBanner?.()
        else setActiveWorkload(initialActiveWorkload)
      }
    }
  }, [toValue])

  // once podLabels arrive, and no explicit toName, apply default (only on initial load, not after user clears)
  useEffect(() => {
    if (activeWorkload && podLabels && !toName && !toValue && circuitBreaker) {
      const match = getDefaultPodLabel(activeWorkload, podLabels)
      if (match) {
        setValue(`${prefixName}.toLabelName`, match.name)
        setValue(`${prefixName}.toLabelValue`, match.value)
      }
    }
  }, [activeWorkload, podLabels, toName, toValue, circuitBreaker])

  // once the user has picked or defaulted a toName/toValue, fetch matching pod names
  const rawSelector = toName && toValue ? `${toName}=${toValue}` : ''

  return (
    <FormRow spacing={10}>
      <Autocomplete<WorkloadOption, false, false, false>
        label='Workload'
        width='large'
        multiple={false}
        options={workloadOptions}
        groupBy={(opt) => opt.namespace}
        getOptionLabel={(opt) => opt.name}
        value={selectedWorkloadOption}
        onChange={(_e, opt) => {
          setActiveWorkload(opt?.name ?? '')
          if (!opt) setCircuitBreaker(false)
        }}
      />

      <Autocomplete
        label='Pod Label'
        multiple={false}
        options={labelOptions}
        value={rawSelector || null}
        width='large'
        onChange={(_e, newVal) => {
          if (!newVal) {
            setValue(`${prefixName}.toLabelName`, '')
            setValue(`${prefixName}.toLabelValue`, '')
            setCircuitBreaker(false)
            return
          }
          const [name, value] = newVal.split('=', 2) ?? []
          setValue(`${prefixName}.toLabelName`, name)
          setValue(`${prefixName}.toLabelValue`, value)
        }}
        errorText={targetValueError || ''}
        helperText={targetValueError || ''}
      />
    </FormRow>
  )
}
