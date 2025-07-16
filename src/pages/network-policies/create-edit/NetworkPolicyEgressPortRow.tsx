// NetworkPolicyPortRow.tsx
import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Autocomplete } from 'components/forms/Autocomplete'
import FormRow from 'components/forms/FormRow'

type Protocol = 'HTTP' | 'HTTPS' | 'TCP'
const PROTOCOL_OPTIONS: Protocol[] = ['HTTP', 'HTTPS', 'TCP']

const COMMON_PORT_OPTIONS = ['HTTPS (443)', 'HTTP (80)', 'SMTP (25)', 'MySQL (3306)', 'PostgreSQL (5432)']

interface FormValues {
  ruleType: {
    egress: {
      ports: Array<{ protocol: Protocol; number: number }>
    }
  }
}

interface Props {
  fieldArrayName: `ruleType.egress.ports.${number}`
  rowIndex: number
}

export default function NetworkPolicyPortRow({ fieldArrayName, rowIndex }: Props) {
  const { control } = useFormContext<FormValues>()

  // protocol stays uppercase
  const { field: protocolField } = useController({
    control,
    name: `${fieldArrayName}.protocol`,
    defaultValue: 'TCP' as Protocol,
  })

  // number starts undefined
  const { field: numberField } = useController({
    control,
    name: `${fieldArrayName}.number`,
    defaultValue: undefined as unknown as number,
  })

  // show the raw number (or empty) in the input
  const displayValue = numberField.value != null ? numberField.value.toString() : ''

  return (
    <FormRow spacing={10}>
      <Autocomplete<Protocol, false, false, false>
        options={PROTOCOL_OPTIONS}
        value={protocolField.value}
        onChange={(_e, v) => protocolField.onChange(v)}
        label={rowIndex === 0 ? 'Protocol' : ''}
        width='large'
      />

      <Autocomplete<string, false, true, true>
        freeSolo
        options={COMMON_PORT_OPTIONS}
        value={displayValue}
        onChange={(_e, v) => {
          if (!v) {
            numberField.onChange(undefined)
            return
          }
          // if they picked "HTTPS (443)", grab the digits; else use raw
          const m = v.match(/\((\d+)\)$/)
          const str = m ? m[1] : v
          const parsed = parseInt(str, 10)
          if (!Number.isNaN(parsed)) numberField.onChange(parsed)
          else {
            // best‐effort: if they typed garbage, clear and let validation catch it
            numberField.onChange(undefined)
          }
        }}
        label={rowIndex === 0 ? 'Port' : ''}
        width='large'
      />
    </FormRow>
  )
}
