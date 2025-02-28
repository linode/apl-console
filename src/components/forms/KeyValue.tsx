// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { makeStyles } from '@mui/styles'
import { Add, Clear } from '@mui/icons-material'
import { Typography } from 'components/Typography'
import { InputLabel } from 'components/InputLabel'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { isEmpty } from 'lodash'
import FormRow from './FormRow'

const useStyles = makeStyles({
  container: {
    padding: '16px',
    backgroundColor: '#424242',
    borderRadius: '8px',
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
  },
})

interface KeyValueProps {
  title: string
  subTitle?: string
  keyLabel?: string
  keyValue?: string
  keyDisabled?: boolean
  valueLabel?: string
  valueDisabled?: boolean
  addLabel?: string
  name: string
  onlyValue?: boolean
}

export default function KeyValue(props: KeyValueProps) {
  const classes = useStyles()
  const { control, register } = useFormContext()
  const [items, setItems] = useState([{ key: '', value: '' }])
  const {
    title,
    subTitle,
    keyLabel,
    valueLabel,
    addLabel,
    name,
    onlyValue,
    keyValue,
    keyDisabled = false,
    valueDisabled = false,
  } = props

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const handleAddItem = () => {
    append(onlyValue ? '' : { key: '', value: '' })
  }

  useEffect(() => {
    handleAddItem()
  }, [])

  return (
    <Box>
      <InputLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</InputLabel>
      {subTitle && <Typography sx={{ color: '#ABABAB' }}>{subTitle}</Typography>}

      {fields.map((item, index) => (
        <FormRow key={item.id} spacing={10}>
          <TextField
            sx={{ color: '#B5B5BC' }}
            disabled={keyDisabled}
            value={keyValue}
            label={index === 0 ? keyLabel : ''}
            {...(!onlyValue && !isEmpty(keyLabel) ? register(`${name}.${index}.key}`) : {})}
          />
          <TextField
            disabled={valueDisabled}
            label={index === 0 ? valueLabel : ''}
            {...register(onlyValue && isEmpty(valueLabel) ? `${name}.${index}` : `${name}.${index}.value}`)}
          />
          {addLabel && (
            <IconButton onClick={() => remove(index)}>
              <Clear />
            </IconButton>
          )}
        </FormRow>
      ))}
      {addLabel && (
        <Button className={classes.addItemButton} onClick={handleAddItem}>
          <Add /> {addLabel}
        </Button>
      )}
    </Box>
  )
}
