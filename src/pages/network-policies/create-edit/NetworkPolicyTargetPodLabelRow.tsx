// NetworkPolicyToLabelRow.tsx
import { MenuItem } from '@mui/material'
import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { TextField } from 'components/forms/TextField'
import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useGetK8SWorkloadPodLabelsQuery } from 'redux/otomiApi'

interface Props {
  aplWorkloads: any[]
  teamId: string
  prefixName: string // e.g. "ruleType.ingress"
}

export default function NetworkPolicyTargetLabelRow({ aplWorkloads, teamId, prefixName }: Props) {
  const { watch, setValue } = useFormContext()
  const [activeWorkload, setActiveWorkload] = useState('')

  // grab existing toLabelName/value
  const toName = watch(`${prefixName}.toLabelName`) || ''
  const toValue = watch(`${prefixName}.toLabelValue`) || ''
  const selected = toName && toValue ? `${toName}:${toValue}` : ''

  // fetch pod labels for dropdown
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload },
    { skip: !activeWorkload },
  )

  // unify label options
  const options = useMemo(() => Object.entries(podLabels ?? {}).map(([k, v]) => `${k}:${v}`), [podLabels])

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
        label='To label'
        multiple={false}
        options={options}
        value={selected}
        width='large'
        onChange={(_, newVal) => {
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
