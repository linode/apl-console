// components/forms/IngressKeyValue.tsx
import React from 'react'
import { Box, Button, IconButton, MenuItem } from '@mui/material'
import { Add, Clear } from '@mui/icons-material'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import FormRow from 'components/forms/FormRow'
import { TextField } from 'components/forms/TextField'
import { Autocomplete } from 'components/forms/Autocomplete'

export interface IngressRule {
  workload: string
  labels: string[]
}

interface IngressKeyValueProps {
  /** name of the field‐array in your form, e.g. "ingressRules" */
  name: string
  /** list of available workloads to choose from */
  aplWorkloads: Array<{ metadata: { name: string } }>
  /** map from workload name → its pod‐labels, as { [k:v] } */
  workloadPodLabels: Record<string, Record<string, string>>
}

export default function IngressKeyValue({ name, aplWorkloads, workloadPodLabels }: IngressKeyValueProps) {
  const { control, register } = useFormContext()
  const { fields, append, remove } = useFieldArray<IngressRule>({
    control,
    name,
  })

  return (
    <Box>
      {fields.map((field, idx) => {
        // derive label‐options for this row’s current workload
        const labelsMap = workloadPodLabels[field.workload] ?? {}
        const labelOptions = Object.entries(labelsMap).map(([k, v]) => `${k}: ${v}`)

        return (
          <FormRow spacing={10} key={field.id}>
            {/* workload dropdown */}
            <TextField label='Workload' width='large' select {...register(`${name}.${idx}.workload` as const)}>
              <MenuItem value='' disabled>
                Select a workload
              </MenuItem>
              {aplWorkloads.map((w) => (
                <MenuItem key={w.metadata.name} value={w.metadata.name}>
                  {w.metadata.name}
                </MenuItem>
              ))}
            </TextField>

            {/* labels multi‐select */}
            <Controller
              name={`${name}.${idx}.labels` as const}
              control={control}
              defaultValue={[]}
              render={({ field: { value, onChange } }) => (
                <Autocomplete<string, true>
                  label='Label(s)'
                  multiple
                  width='large'
                  disablePortal={false}
                  options={labelOptions}
                  value={value}
                  onChange={(_, newVals) => onChange(newVals)}
                  renderInput={(params) => <TextField {...params} label='' placeholder='Select labels' width='large' />}
                />
              )}
            />

            {/* remove‐row button */}
            <IconButton onClick={() => remove(idx)}>
              <Clear />
            </IconButton>
          </FormRow>
        )
      })}

      {/* add‐row button */}
      <Box mt={2}>
        <Button startIcon={<Add />} onClick={() => append({ workload: '', labels: [] })}>
          Add inbound rule
        </Button>
      </Box>
    </Box>
  )
}
