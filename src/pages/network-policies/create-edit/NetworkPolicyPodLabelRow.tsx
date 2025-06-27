// NetworkPolicyPodLabelRow.tsx

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Autocomplete } from 'components/forms/Autocomplete'
import { TextField } from 'components/forms/TextField'
import FormRow from 'components/forms/FormRow'
import { useMemo, useState } from 'react'
import { MenuItem } from '@mui/material'
import { useGetK8SWorkloadPodLabelsQuery } from 'redux/otomiApi'

interface Props {
  aplWorkloads: any[]
  teamId: string
  fieldArrayName: string
}

export default function NetworkPolicyPodLabelRow({ aplWorkloads, teamId, fieldArrayName }: Props) {
  const { control, watch, setValue } = useFormContext()
  const [activeWorkload, setActiveWorkload] = useState<string>('')

  const { fields, replace } = useFieldArray({
    control,
    name: fieldArrayName,
  })

  // lookup namespace label once workload is picked
  const namespace = useMemo(() => {
    const workload = aplWorkloads.find((workload) => workload.metadata.name === activeWorkload)
    const workloadLabel = workload?.metadata.labels?.['apl.io/teamId'] || ''
    return `team-${workloadLabel}`
  }, [activeWorkload, aplWorkloads])

  // fetch pod labels for current workload
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload },
    { skip: !activeWorkload },
  )

  // when user picks labels, map them into your RHF array
  const selected = fields.map((f) => `${f.fromLabelName}:${f.fromLabelValue}`)
  return (
    <FormRow spacing={10}>
      <TextField label='Workload' select onChange={(e) => setActiveWorkload(e.target.value)} width='large'>
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
        label='Label(s)'
        multiple
        width='large'
        options={Object.entries(podLabels ?? {}).map(([labelName, labelValue]) => `${labelName}:${labelValue}`)}
        value={selected}
        onChange={(_, newValues: string[]) => {
          // each "key:value" → { fromNamespace, fromLabelName, fromLabelValue }
          const items = newValues.map((entry) => {
            const [fromLabelName, fromLabelValue] = entry.split(':')
            return { fromNamespace: namespace, fromLabelName, fromLabelValue }
          })
          replace(items)
        }}
      />
    </FormRow>
  )
}
