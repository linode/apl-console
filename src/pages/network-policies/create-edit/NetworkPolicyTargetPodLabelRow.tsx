// NetworkPolicyTargetLabelRow.tsx
import { MenuItem } from '@mui/material'
import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { TextField } from 'components/forms/TextField'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGetK8SWorkloadPodLabelsQuery, useListUniquePodNamesByLabelQuery } from 'redux/otomiApi'

interface Props {
  aplWorkloads: any[]
  teamId: string
  prefixName: string // e.g. "ruleType.ingress"
  onPodNamesChange: (namespace: string, podNames: string[], role: 'target') => void
}

export default function NetworkPolicyTargetLabelRow({ aplWorkloads, teamId, prefixName, onPodNamesChange }: Props) {
  const { watch, setValue } = useFormContext()

  // 1) track which workload is selected
  const [activeWorkload, setActiveWorkload] = useState('')

  // 2) pull out the saved toLabelName/value from RHF
  const toName = watch(`${prefixName}.toLabelName`) || ''
  const toValue = watch(`${prefixName}.toLabelValue`) || ''

  // 3) when user picks a workload, derive its namespace
  const namespace = useMemo(() => {
    const w = aplWorkloads.find((w) => w.metadata.name === activeWorkload)
    const teamLabel = w?.metadata.labels?.['apl.io/teamId'] || ''
    return `team-${teamLabel}`
  }, [activeWorkload, aplWorkloads])

  // 4) fetch the label‐>value map for that pod spec
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload },
    { skip: !activeWorkload },
  )
  const labelOptions = useMemo(() => Object.entries(podLabels ?? {}).map(([k, v]) => `${k}:${v}`), [podLabels])

  // 5) once the user has picked a toName/toValue, fetch matching pod names
  const rawSelector = toName && toValue ? `${toName}=${toValue}` : ''
  const { data: podNames } = useListUniquePodNamesByLabelQuery(
    {
      teamId,
      labelSelector: rawSelector,
      namespace,
    },
    { skip: !rawSelector },
  )

  // 6) when podNames arrives, bubble up to the parent
  useEffect(() => {
    if (podNames && podNames.length > 0) onPodNamesChange(namespace, podNames, 'target')
  }, [podNames])

  // 7) render
  const selected = rawSelector

  return (
    <FormRow spacing={10}>
      <TextField
        label='Workload'
        select
        value={activeWorkload}
        onChange={(e) => setActiveWorkload(e.target.value)}
        width='large'
      >
        <MenuItem value='' disabled>
          Select a workload
        </MenuItem>
        {aplWorkloads.map((w) => (
          <MenuItem key={w.metadata.name} value={w.metadata.name}>
            {w.metadata.name}
          </MenuItem>
        ))}
      </TextField>

      <Autocomplete
        label='To label'
        multiple={false}
        options={labelOptions}
        value={selected || null}
        width='large'
        onChange={(_e, newVal) => {
          if (!newVal) {
            setValue(`${prefixName}.toLabelName`, '')
            setValue(`${prefixName}.toLabelValue`, '')
            return
          }
          const [name, value] = newVal.split(':')
          setValue(`${prefixName}.toLabelName`, name)
          setValue(`${prefixName}.toLabelValue`, value)
        }}
      />
    </FormRow>
  )
}
