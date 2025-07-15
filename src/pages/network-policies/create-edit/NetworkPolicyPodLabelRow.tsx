import { FieldPath, useController, useFormContext } from 'react-hook-form'
import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { useEffect, useMemo, useState } from 'react'
import { useGetK8SWorkloadPodLabelsQuery, useListUniquePodNamesByLabelQuery } from 'redux/otomiApi'
import { getDefaultPodLabel, getInitialActiveWorkload } from './NetworkPolicyPodLabelMatchHelper'

interface Props {
  aplWorkloads: any[]
  teamId: string
  fieldArrayName: FieldPath<FormValues>
  rowIndex?: number
  rowType: 'source' | 'target'
  onPodNamesChange: (namespace: string, podNames: string[], role: 'source' | 'target') => void
}

interface PodLabelMatch {
  fromNamespace: string
  fromLabelName: string
  fromLabelValue?: string
}

interface ActiveLabel {
  label: string
  namespace: string
}

interface WorkloadOption {
  name: string
  namespace: string
}

interface FormValues {
  ruleType: {
    ingress: {
      allow: PodLabelMatch[]
    }
  }
  [key: string]: any
}

export default function NetworkPolicyPodLabelRow({
  aplWorkloads,
  teamId,
  fieldArrayName,
  rowIndex,
  rowType,
  onPodNamesChange,
}: Props) {
  const { control } = useFormContext<FormValues>()
  const { field } = useController<FormValues>({ control, name: fieldArrayName })

  const [activeWorkload, setActiveWorkload] = useState<string>('')
  const [activeLabel, setActiveLabel] = useState<ActiveLabel>({ label: '', namespace: '' })
  const [circuitBreaker, setCircuitBreaker] = useState<boolean>(true)

  // derive namespace from the selected workload
  const namespace = useMemo(() => {
    const w = aplWorkloads.find((w) => w.metadata.name === activeWorkload)
    const teamLabel = w?.metadata.labels?.['apl.io/teamId'] || ''
    return `team-${teamLabel}`
  }, [activeWorkload, aplWorkloads])

  // build and sort workload options
  const workloadOptions = useMemo(
    () =>
      aplWorkloads
        .map((w) => {
          const ns = `team-${w.metadata.labels?.['apl.io/teamId'] || ''}`
          return { name: w.metadata.name, namespace: ns }
        })
        .sort((a, b) => a.namespace.localeCompare(b.namespace) || a.name.localeCompare(b.name)),
    [aplWorkloads],
  )
  const selectedWorkloadOption = workloadOptions.find((o) => o.name === activeWorkload) || null

  // fetch pod‐labels & pod-names
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload },
    { skip: !activeWorkload },
  )
  const { data: podNames } = useListUniquePodNamesByLabelQuery(
    { teamId, labelSelector: activeLabel.label, namespace: activeLabel.namespace },
    { skip: !activeLabel.label },
  )

  // Initial edit-mode circuitbreaker, prevent prepopulated fields from starting a rerender loop
  useEffect(() => {
    const { fromLabelValue } = field.value as PodLabelMatch
    if (fromLabelValue) {
      const initialActiveWorkload = getInitialActiveWorkload(fromLabelValue, aplWorkloads)
      setActiveWorkload(initialActiveWorkload)
    } else setCircuitBreaker(false)
  }, [])

  // notify parent of podNames
  useEffect(() => {
    if (podNames && podNames.length) onPodNamesChange(activeLabel.namespace, podNames, rowType)
  }, [podNames])

  // clear label when workload manually selected
  useEffect(() => {
    if (circuitBreaker || !activeWorkload) return
    field.onChange({ fromNamespace: '', fromLabelName: '', fromLabelValue: undefined })
    setActiveLabel({ label: '', namespace: '' })
  }, [activeWorkload])

  // default match on create
  useEffect(() => {
    if (podLabels && circuitBreaker) setCircuitBreaker(false)
    if (!activeWorkload || !podLabels) return
    const match = getDefaultPodLabel(activeWorkload, podLabels)
    if (match) {
      field.onChange({ fromNamespace: namespace, fromLabelName: match.name, fromLabelValue: match.value })
      setActiveLabel({ label: `${match.name}=${match.value}`, namespace })
    }
  }, [activeWorkload, podLabels])

  return (
    <FormRow spacing={10}>
      <Autocomplete<WorkloadOption, false, false, false>
        label='Workload'
        hideLabel={rowIndex !== 0}
        width='large'
        multiple={false}
        disablePortal={false}
        options={workloadOptions}
        groupBy={(opt) => opt.namespace}
        getOptionLabel={(opt) => opt.name}
        value={selectedWorkloadOption}
        onChange={(_e, opt) => setActiveWorkload(opt?.name ?? '')}
      />

      <Autocomplete
        hideLabel={rowIndex !== 0}
        label='Label'
        width='large'
        multiple={false}
        disablePortal={false}
        options={Object.entries((podLabels as Record<string, string>) ?? {}).map(([k, v]) => `${k}:${v}`)}
        value={field.value?.fromLabelName ? `${field.value.fromLabelName}:${field.value.fromLabelValue ?? ''}` : null}
        onChange={(_e, raw: string | null) => {
          const [name, value] = raw?.split(':', 2) ?? []
          field.onChange({ fromNamespace: namespace, fromLabelName: name, fromLabelValue: value })
          setActiveLabel({ label: `${name}=${value}`, namespace })
        }}
      />
    </FormRow>
  )
}
