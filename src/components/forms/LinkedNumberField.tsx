import { Box, FormHelperText } from '@mui/material'
import { useEffect } from 'react'
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
  const valueA: number = watch(registers.registerA.name) ?? defaultValue
  const valueB: number = watch(registers.registerB.name) ?? defaultValue

  useEffect(() => {
    setValue(registers.registerA.name, valueMax / 2)
    setValue(registers.registerB.name, valueMax / 2)
  }, [setValue])

  function calculateValues(updatedValue: number, isValueA: boolean) {
    if (updatedValue < 0) {
      setValue(registers.registerA.name, isValueA ? 0 : valueMax)
      setValue(registers.registerB.name, isValueA ? valueMax : 0)
      return
    }
    if (updatedValue > valueMax) {
      setValue(registers.registerA.name, isValueA ? valueMax : 0)
      setValue(registers.registerB.name, isValueA ? 0 : valueMax)
      return
    }

    setValue(registers.registerA.name, isValueA ? updatedValue : valueMax - updatedValue)
    setValue(registers.registerB.name, isValueA ? valueMax - updatedValue : updatedValue)
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
