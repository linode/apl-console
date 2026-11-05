import React, { useState } from 'react'
import { Box } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { Typography } from 'components/Typography'
import { InputLabel } from 'components/InputLabel'
import { useFieldArray, useFormContext } from 'react-hook-form'
import FormRow from './FormRow'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: '16px',
    backgroundColor: theme.palette.cm.textBox,
    borderRadius: 0,
  },
  itemRow: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  addItemButton: {
    marginLeft: '-10px',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'none',
    borderRadius: '1px',
  },
}))

interface registers {
  registerA: any
  registerB: any
}

interface KeyValueProps {
  title: string
  subTitle?: string
  keyLabel: string
  keyValue?: string
  keyDisabled?: boolean
  showLabel?: boolean
  valueLabel: string
  valueDisabled?: boolean
  name: string
  registers?: registers
}

export default function KeyValue(props: KeyValueProps) {
  const classes = useStyles()
  const { control, register } = useFormContext()

  const {
    title,
    subTitle,
    keyLabel,
    valueLabel,
    name,
    keyValue,
    keyDisabled = false,
    showLabel = true,
    valueDisabled = false,
    registers,
  } = props

  const [items, setItems] = useState([{ [keyLabel.toLowerCase()]: '', [valueLabel.toLowerCase()]: '' }])

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <Box>
      <InputLabel sx={(theme) => ({ fontFamily: theme.font.bold, fontWeight: 700, fontSize: '14px' })}>
        {title}
      </InputLabel>
      {subTitle && <Typography sx={{ color: 'text.secondary' }}>{subTitle}</Typography>}

      <FormRow spacing={10}>
        <TextField
          sx={{ color: 'text.secondary' }}
          disabled={keyDisabled}
          value={keyValue}
          label={showLabel ? keyLabel : ''}
          {...registers.registerA}
        />
        <TextField disabled={valueDisabled} label={showLabel ? valueLabel : ''} {...registers.registerB} />
      </FormRow>
    </Box>
  )
}
