import { useFieldArray, useFormContext } from 'react-hook-form'
import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { useEffect, useMemo, useState } from 'react'
import { useGetK8SWorkloadPodLabelsQuery, useListUniquePodNamesByLabelQuery } from 'redux/otomiApi'
import { getDefaultPodLabel } from './NetworkPolicyPodLabelMatchHelper'

interface Props {
  aplWorkloads: any[]
  teamId: string
  fieldArrayName: string
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
  [key: string]: PodLabelMatch[]
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
  const [activeWorkload, setActiveWorkload] = useState<string>('')
  const [activeLabel, setActiveLabel] = useState<ActiveLabel>({ label: '', namespace: '' })

  // derive namespace from the selected workload
  const namespace = useMemo(() => {
    const w = aplWorkloads.find((w) => w.metadata.name === activeWorkload)
    const teamLabel = w?.metadata.labels?.['apl.io/teamId'] || ''
    return `team-${teamLabel}`
  }, [activeWorkload, aplWorkloads])

  // 1) build and sort workload options
  const workloadOptions = useMemo(() => {
    return aplWorkloads
      .map((w) => {
        const ns = `team-${w.metadata.labels?.['apl.io/teamId'] || ''}`
        return { name: w.metadata.name, namespace: ns }
      })
      .sort((a, b) => a.namespace.localeCompare(b.namespace) || a.name.localeCompare(b.name))
  }, [aplWorkloads])

  // 2) find the currently selected option object
  const selectedWorkloadOption = workloadOptions.find((o) => o.name === activeWorkload) || null

  // fetch pod‐labels for the active workload
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload },
    { skip: !activeWorkload },
  )
  const { data: podNames } = useListUniquePodNamesByLabelQuery(
    { teamId, labelSelector: activeLabel.label, namespace: activeLabel.namespace },
    { skip: !activeLabel.label },
  )

  const { fields, replace } = useFieldArray<FormValues>({
    control,
    name: fieldArrayName,
  })
  // 1) clear out any old label whenever the workload changes
  useEffect(() => {
    replace([])
  }, [activeWorkload, replace])

  // 2) once podLabels arrive, and ONLY if there is no existing entry,
  //    apply the default match
  useEffect(() => {
    if (
      !activeWorkload ||
      !podLabels ||
      fields.length > 0 // <-- DON'T overwrite if user already has a value
    )
      return

    const match = getDefaultPodLabel(activeWorkload, podLabels)
    if (match) {
      replace([
        {
          fromNamespace: namespace,
          fromLabelName: match.name,
          fromLabelValue: match.value,
        },
      ])
    }
  }, [activeWorkload, podLabels, namespace, fields.length, replace])

  useEffect(() => {
    if (podNames && podNames.length) onPodNamesChange(namespace, podNames, rowType)
  }, [podNames])

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
        onChange={(_e, opt) => {
          setActiveWorkload(opt?.name ?? '')
        }}
      />

      <Autocomplete
        hideLabel={rowIndex !== 0}
        label='Label'
        width='large'
        multiple={false}
        disablePortal={false}
        options={Object.entries((podLabels as Record<string, string>) ?? {}).map(([key, value]) => `${key}:${value}`)}
        value={fields[0] ? `${fields[0].fromLabelName}:${fields[0].fromLabelValue ?? ''}` : null}
        onChange={(_e, raw: string | null) => {
          const [name, value] = raw.split(':', 2)
          replace([{ fromNamespace: namespace, fromLabelName: name, fromLabelValue: value }])
          setActiveLabel({ label: `${name}=${value}`, namespace })
        }}
      />
    </FormRow>
  )
}
