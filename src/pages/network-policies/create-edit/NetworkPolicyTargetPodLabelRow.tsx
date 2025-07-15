import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGetK8SWorkloadPodLabelsQuery, useListUniquePodNamesByLabelQuery } from 'redux/otomiApi'
import { getDefaultPodLabel, getInitialActiveWorkload } from './NetworkPolicyPodLabelMatchHelper'

interface Props {
  aplWorkloads: any[]
  teamId: string
  prefixName: string
  onPodNamesChange: (namespace: string, podNames: string[], role: 'target') => void
}

interface WorkloadOption {
  name: string
  namespace: string
}

export default function NetworkPolicyTargetLabelRow({ aplWorkloads, teamId, prefixName, onPodNamesChange }: Props) {
  const { watch, setValue } = useFormContext()
  const [circuitBreaker, setCircuitBreaker] = useState(true)
  const [activeWorkload, setActiveWorkload] = useState<string>('')

  const toName = watch(`${prefixName}.toLabelName`) || ''
  const toValue = watch(`${prefixName}.toLabelValue`) || ''

  // derive namespace from selected workload
  const namespace = useMemo(() => {
    const w = aplWorkloads.find((w) => w.metadata.name === activeWorkload)
    const teamLabel = w?.metadata.labels?.['apl.io/teamId'] || ''
    return `team-${teamLabel}`
  }, [activeWorkload, aplWorkloads])

  // build workload options, but only those in this team’s namespace
  const workloadOptions = useMemo<WorkloadOption[]>(() => {
    return aplWorkloads
      .map((w) => ({
        name: w.metadata.name,
        namespace: `team-${w.metadata.labels?.['apl.io/teamId'] || ''}`,
      }))
      .filter((o) => o.namespace === `team-${teamId}`)
      .sort((a, b) => a.namespace.localeCompare(b.namespace) || a.name.localeCompare(b.name))
  }, [aplWorkloads, teamId])

  // find the currently selected option object
  const selectedWorkloadOption = workloadOptions.find((o) => o.name === activeWorkload) || null

  // fetch the label→value map for that pod spec
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload },
    { skip: !activeWorkload },
  )
  const labelOptions = useMemo(() => Object.entries(podLabels ?? {}).map(([k, v]) => `${k}:${v}`), [podLabels])

  // Initial edit-mode circuitbreaker, prevent prepopulated fields from starting a rerender loop
  useEffect(() => {
    if (toValue && circuitBreaker) {
      setCircuitBreaker(false)
      const initialActiveWorkload = getInitialActiveWorkload(toValue, aplWorkloads)
      setActiveWorkload(initialActiveWorkload)
    }
  }, [toValue])

  // once podLabels arrive, and no explicit toName, apply default
  useEffect(() => {
    if (activeWorkload && podLabels) {
      const match = getDefaultPodLabel(activeWorkload, podLabels)
      if (match) {
        setValue(`${prefixName}.toLabelName`, match.name)
        setValue(`${prefixName}.toLabelValue`, match.value)
      }
    }
  }, [activeWorkload, podLabels])

  // once the user has picked or defaulted a toName/toValue, fetch matching pod names
  const rawSelector = toName && toValue ? `${toName}=${toValue}` : ''
  const { data: podNames } = useListUniquePodNamesByLabelQuery(
    {
      teamId,
      labelSelector: rawSelector,
      namespace,
    },
    { skip: !rawSelector },
  )

  // notify parent of podNames
  useEffect(() => {
    if (podNames && podNames.length > 0) onPodNamesChange(namespace, podNames, 'target')
  }, [podNames])

  return (
    <FormRow spacing={10}>
      <Autocomplete<WorkloadOption, false, false, false>
        label='Workload'
        width='large'
        multiple={false}
        disablePortal={false}
        options={workloadOptions}
        groupBy={(opt) => opt.namespace}
        getOptionLabel={(opt) => opt.name}
        value={selectedWorkloadOption}
        onChange={(_e, opt) => {
          setActiveWorkload(opt?.name ?? '')
        }}
      />

      <Autocomplete
        label='To label'
        multiple={false}
        options={labelOptions}
        value={rawSelector || null}
        width='large'
        onChange={(_e, newVal) => {
          if (!newVal) {
            setValue(`${prefixName}.toLabelName`, '')
            setValue(`${prefixName}.toLabelValue`, '')
            return
          }
          const [name, value] = newVal.split(':', 2)
          setValue(`${prefixName}.toLabelName`, name)
          setValue(`${prefixName}.toLabelValue`, value)
        }}
      />
    </FormRow>
  )
}
