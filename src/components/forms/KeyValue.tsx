// @ts-nocheck
import React, { useEffect } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { makeStyles } from '@mui/styles'
import { Add, Remove } from '@mui/icons-material'
import { Typography } from 'components/Typography'
import { InputLabel } from 'components/InputLabel'
import { useFieldArray, useFormContext } from 'react-hook-form'
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
  keyLabel: string
  valueLabel: string
  addLabel?: string
  name: string
  onlyValue?: boolean
}

export default function KeyValue(props: KeyValueProps) {
  const classes = useStyles()
  const { control, register } = useFormContext()
  const { title, subTitle, keyLabel, valueLabel, addLabel, name, onlyValue } = props

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const handleAddItem = () => {
    append(onlyValue ? '' : {})
  }

  useEffect(() => {
    handleAddItem()
  }, [])

  return (
    <Box>
      <InputLabel>{title}</InputLabel>
      {subTitle && <Typography>{subTitle}</Typography>}

      {fields.map((item, index) => (
        <FormRow key={item.id} spacing={10}>
          <TextField
            label={index === 0 ? keyLabel : ''}
            {...(!onlyValue ? register(`${name}.${index}.${keyLabel.toLowerCase()}`) : {})}
          />
          <TextField
            label={index === 0 ? valueLabel : ''}
            {...register(onlyValue ? `${name}.${index}` : `${name}.${index}.${valueLabel.toLowerCase()}`)}
          />
          {addLabel && (
            <IconButton onClick={() => remove(index)}>
              <Remove />
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
