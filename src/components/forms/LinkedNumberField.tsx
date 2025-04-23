import { Box, FormHelperText } from '@mui/material'
import { TextField } from './TextField'
import FormRow from './FormRow'

interface Registers {
  registerA: any
  registerB: any
  setValue: (name: string, value: any) => void
  watch: (name: string) => any
}

interface LinkedNumberFieldProps {
  labelA: string
  labelB: string
  valueMax: number
  disabled: boolean
  registers: Registers
  helperText?: string
  error?: boolean
}

export default function LinkedNumberField({
  labelA,
  labelB,
  valueMax,
  disabled,
  registers,
  error,
  helperText,
}: LinkedNumberFieldProps) {
  const { setValue, watch } = registers
  const defaultValue = valueMax / 2
  const rawA = watch(registers.registerA.name)
  const rawB = watch(registers.registerB.name)

  const valueA: number = Math.min(Math.max(rawA ?? defaultValue, 0), valueMax)
  const valueB: number = Math.min(Math.max(rawB ?? defaultValue, 0), valueMax)

  function calculateValues(updatedValue: number, isValueA: boolean) {
    const clamped = Math.min(Math.max(updatedValue, 0), valueMax)
    const complementary = valueMax - clamped

    if (isValueA) {
      setValue(registers.registerA.name, clamped)
      setValue(registers.registerB.name, complementary)
    } else {
      setValue(registers.registerA.name, complementary)
      setValue(registers.registerB.name, clamped)
    }
  }

  // Increment/Decrement helpers
  const incrementA = () => calculateValues(valueA + 1, true)
  const decrementA = () => calculateValues(valueA - 1, true)
  const incrementB = () => calculateValues(valueB + 1, false)
  const decrementB = () => calculateValues(valueB - 1, false)

  return (
    <Box>
      <FormRow spacing={10}>
        <TextField
          {...registers.registerA}
          width='small'
          label={labelA}
          value={valueA}
          type='number'
          inputProps={{ min: 0, max: valueMax }}
          onChange={(e) => calculateValues(Number(e.target.value), true)}
          onIncrement={incrementA}
          onDecrement={decrementA}
          suffixSymbol='%'
          disabled={disabled}
          error={error}
        />
        <TextField
          {...registers.registerB}
          width='small'
          label={labelB}
          value={valueB}
          type='number'
          inputProps={{ min: 0, max: valueMax }}
          onChange={(e) => calculateValues(Number(e.target.value), false)}
          onIncrement={incrementB}
          onDecrement={decrementB}
          suffixSymbol='%'
          disabled={disabled}
          error={error}
        />
      </FormRow>
      {helperText && <FormHelperText data-qa-textfield-helper-text>{helperText}</FormHelperText>}
    </Box>
  )
}
