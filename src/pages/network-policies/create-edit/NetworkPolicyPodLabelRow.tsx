// NetworkPolicyPodLabelRow.tsx

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Autocomplete } from 'components/forms/Autocomplete'
import { TextField } from 'components/forms/TextField'
import FormRow from 'components/forms/FormRow'
import { useEffect, useMemo, useState } from 'react'
import { MenuItem } from '@mui/material'
import { useGetK8SWorkloadPodLabelsQuery } from 'redux/otomiApi'
import { getDefaultPodLabel } from './NetworkPolicyPodLabelMatchHelper'

interface Props {
  aplWorkloads: any[]
  teamId: string
  fieldArrayName: string
}

interface PodLabelMatch {
  fromNamespace: string
  fromLabelName: string
  fromLabelValue?: string
}

export default function NetworkPolicyPodLabelRow({ aplWorkloads, teamId, fieldArrayName }: Props) {
  const { control } = useFormContext()
  const [activeWorkload, setActiveWorkload] = useState<string>('')

  // derive namespace from the selected workload
  const namespace = useMemo(() => {
    const w = aplWorkloads.find((w) => w.metadata.name === activeWorkload)
    const teamLabel = w?.metadata.labels?.['apl.io/teamId'] || ''
    return `team-${teamLabel}`
  }, [activeWorkload, aplWorkloads])

  // fetch pod‐labels for the active workload
  const { data: podLabels } = useGetK8SWorkloadPodLabelsQuery(
    { teamId, workloadName: activeWorkload },
    { skip: !activeWorkload },
  )

  // we'll only ever store one entry here
  const { fields, replace } = useFieldArray<PodLabelMatch>({
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

  // render the current "key:value" or empty
  const selected = fields[0] ? `${fields[0].fromLabelName}:${fields[0].fromLabelValue ?? ''}` : null

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
        label='Label'
        width='large'
        multiple={false}
        options={Object.entries(podLabels ?? {}).map(([k, v]) => `${k}:${v}`)}
        value={selected}
        onChange={(_e, raw: string | null) => {
          if (!raw) return replace([])
          const [name, value] = raw.split(':', 2)
          replace([
            {
              fromNamespace: namespace,
              fromLabelName: name,
              fromLabelValue: value,
            },
          ])
        }}
      />
    </FormRow>
  )
}
