import { Box } from '@mui/material'
import { useState } from 'react'
import { TextField } from './TextField'
import FormRow from './FormRow'

interface registers {
  registerA: any
  registerB: any
}

interface LinkedNumberFieldProps {
  labelA: string
  labelB: string
  valueMax: number
  disabled: boolean
  registers: registers
}

export default function LinkedNumberField({ labelA, labelB, valueMax, disabled, registers }: LinkedNumberFieldProps) {
  const [valueA, setValueA] = useState(valueMax / 2)
  const [valueB, setValueB] = useState(valueMax / 2)

  function calculateValues(updatedValue: number, isValueA: boolean) {
    if (updatedValue < 0) {
      if (isValueA) {
        setValueA(0)
        setValueB(valueMax)
      } else {
        setValueA(valueMax)
        setValueB(0)
      }
      return
    }
    if (updatedValue > valueMax) {
      if (isValueA) {
        setValueA(valueMax)
        setValueB(0)
      } else {
        setValueA(0)
        setValueB(valueMax)
      }
      return
    }

    if (isValueA) {
      setValueA(updatedValue)
      setValueB(valueMax - updatedValue)
    } else {
      setValueB(updatedValue)
      setValueA(valueMax - updatedValue)
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
          onChange={(e) => calculateValues(Number(e.target.value), true)}
          onIncrement={() => incrementA()}
          onDecrement={() => decrementA()}
          suffixSymbol='%'
          disabled={disabled}
        />
        <TextField
          {...registers.registerB}
          width='small'
          label={labelB}
          value={valueB}
          type='number'
          onChange={(e) => calculateValues(Number(e.target.value), false)}
          onIncrement={() => incrementB()}
          onDecrement={() => decrementB()}
          suffixSymbol='%'
          disabled={disabled}
        />
      </FormRow>
    </Box>
  )
}
