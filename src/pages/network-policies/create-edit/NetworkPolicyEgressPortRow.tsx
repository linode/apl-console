import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'
import { TextField } from 'components/forms/TextField'

type Protocol = 'HTTP' | 'HTTPS' | 'TCP'
const PROTOCOL_OPTIONS: Protocol[] = ['HTTP', 'HTTPS', 'TCP']

interface FormValues {
  spec: {
    ruleType: {
      egress: {
        ports: Array<{ protocol: Protocol; number: number }>
      }
    }
  }
}

interface Props {
  fieldArrayName: `spec.ruleType.egress.ports.${number}`
  rowIndex: number
}

export default function NetworkPolicyEgressPortRow({ fieldArrayName, rowIndex }: Props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>()

  const { field: protocolField } = useController({
    control,
    name: `${fieldArrayName}.protocol`,
    defaultValue: 'TCP' as Protocol,
  })

  const portValue = watch(`${fieldArrayName}.number`)
  const portError = errors.spec?.ruleType?.egress?.ports?.[rowIndex]?.number

  return (
    <FormRow spacing={10}>
      <Autocomplete<Protocol, false, false, false>
        options={PROTOCOL_OPTIONS}
        value={protocolField.value}
        onChange={(_e, v) => protocolField.onChange(v)}
        label={rowIndex === 0 ? 'Protocol' : ''}
        width='large'
      />

      <TextField
        name={`${fieldArrayName}.number`}
        label={rowIndex === 0 ? 'Port' : ''}
        width='large'
        value={portValue ?? ''}
        onChange={(e) => setValue(`${fieldArrayName}.number`, e.target.value as any)}
        error={!!portError}
        helperText={portError?.message}
        placeholder='e.g. 443'
      />
    </FormRow>
  )
}
