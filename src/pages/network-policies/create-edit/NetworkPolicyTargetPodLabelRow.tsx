import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGetK8SWorkloadPodLabelsQuery, useListUniquePodNamesByLabelQuery } from 'redux/otomiApi'
import { getDefaultPodLabel } from './NetworkPolicyPodLabelMatchHelper'

interface Props {
  aplWorkloads: any[]
  teamId: string
  prefixName: string // e.g. "ruleType.ingress"
  onPodNamesChange: (namespace: string, podNames: string[], role: 'target') => void
}

interface WorkloadOption {
  name: string
  namespace: string
}

export default function NetworkPolicyTargetLabelRow({ aplWorkloads, teamId, prefixName, onPodNamesChange }: Props) {
  const { watch, setValue } = useFormContext()

  // 1) track which workload is selected
  const [activeWorkload, setActiveWorkload] = useState<string>('')

  // 2) pull out the saved toLabelName/value from RHF
  const toName = watch(`${prefixName}.toLabelName`) || ''
  const toValue = watch(`${prefixName}.toLabelValue`) || ''

  // 3) derive namespace from selected workload
  const namespace = useMemo(() => {
    const w = aplWorkloads.find((w) => w.metadata.name === activeWorkload)
    const teamLabel = w?.metadata.labels?.['apl.io/teamId'] || ''
    return `team-${teamLabel}`
  }, [activeWorkload, aplWorkloads])

  // 4) build workload options, but only those in this team’s namespace
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

  // 5) fetch the label→value map for that pod spec
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload },
    { skip: !activeWorkload },
  )
  const labelOptions = useMemo(() => Object.entries(podLabels ?? {}).map(([k, v]) => `${k}:${v}`), [podLabels])

  // 6) once podLabels arrive, and no explicit toName, apply default
  useEffect(() => {
    if (activeWorkload && podLabels) {
      const match = getDefaultPodLabel(activeWorkload, podLabels)
      if (match) {
        setValue(`${prefixName}.toLabelName`, match.name)
        setValue(`${prefixName}.toLabelValue`, match.value)
      }
    }
  }, [activeWorkload, podLabels])

  // 7) once the user has picked or defaulted a toName/toValue, fetch matching pod names
  const rawSelector = toName && toValue ? `${toName}=${toValue}` : ''
  const { data: podNames } = useListUniquePodNamesByLabelQuery(
    {
      teamId,
      labelSelector: rawSelector,
      namespace,
    },
    { skip: !rawSelector },
  )

  // 8) when podNames arrive, bubble up to the parent
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
