import React, { useEffect, useState } from 'react'
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

  const { field: protocolField } = useController({
    control,
    name: `${fieldArrayName}.protocol`,
    defaultValue: 'TCP' as Protocol,
  })

  const { field: numberField } = useController({
    control,
    name: `${fieldArrayName}.number`,
    defaultValue: undefined as unknown as number,
  })

  // track raw text input for freeSolo
  const [portInput, setPortInput] = useState<string>('')

  // sync external field changes back into input
  useEffect(() => {
    setPortInput(numberField.value != null ? String(numberField.value) : '')
  }, [numberField.value])

  return (
    <FormRow spacing={10}>
      <Autocomplete<Protocol, false, false, false>
        options={PROTOCOL_OPTIONS}
        value={protocolField.value}
        onChange={(_e, v) => protocolField.onChange(v)}
        label={rowIndex === 0 ? 'Protocol' : ''}
        width='large'
      />

      <Autocomplete<string, false, false, true>
        freeSolo
        options={COMMON_PORT_OPTIONS}
        inputValue={portInput}
        onInputChange={(_e, newInput) => setPortInput(newInput)}
        onChange={(_e, selected) => {
          if (selected == null) {
            numberField.onChange(undefined)
            setPortInput('')
            return
          }
          const m = selected.match(/\((\d+)\)$/)
          const str = m ? m[1] : selected
          const parsed = parseInt(str, 10)
          if (!Number.isNaN(parsed)) {
            numberField.onChange(parsed)
            setPortInput(String(parsed))
          } else numberField.onChange(undefined)
        }}
        label={rowIndex === 0 ? 'Port' : ''}
        width='large'
      />
    </FormRow>
  )
}
