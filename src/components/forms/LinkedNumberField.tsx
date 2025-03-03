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
    if (isValueA) {
      console.log('A')
      if (updatedValue < 0) {
        console.log('Smaller than 0')
        setValueA(0)
        setValueB(valueMax)
      } else if (updatedValue > valueMax) {
        console.log(`Bigger than ${valueMax}`)
        setValueA(valueMax)
        setValueB(0)
      } else {
        console.log(`Within Range`)
        const newValueB = valueMax - updatedValue
        setValueA(updatedValue)
        setValueB(newValueB)
      }
    } else if (!isValueA) {
      console.log('B')
      if (updatedValue < 0) {
        console.log('Smaller than 0')
        setValueA(valueMax)
        setValueB(0)
      } else if (updatedValue > valueMax) {
        console.log(`Bigger than ${valueMax}`)
        setValueA(0)
        setValueB(valueMax)
      } else {
        console.log(`Within Range`)
        const newValueA = valueMax - updatedValue
        setValueB(updatedValue)
        setValueA(newValueA)
      }
    }
  }

  return (
    <Box>
      <FormRow spacing={10}>
        <TextField
          {...registers.registerA}
          width='small'
          label={labelA}
          value={valueA}
          onChange={(e) => calculateValues(Number(e.target.value), true)}
          disabled={disabled}
        />
        <TextField
          {...registers.registerB}
          width='small'
          label={labelB}
          value={valueB}
          onChange={(e) => calculateValues(Number(e.target.value), false)}
          disabled={disabled}
        />
      </FormRow>
    </Box>
  )
}
