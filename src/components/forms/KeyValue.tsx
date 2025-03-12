// @ts-nocheck
import React, { useState } from 'react'
import { Box, Button, IconButton, StandardTextFieldProps } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { Add, Clear } from '@mui/icons-material'
import { Typography } from 'components/Typography'
import { InputLabel } from 'components/InputLabel'
import { useFieldArray, useFormContext } from 'react-hook-form'
import FormRow from './FormRow'
import { FormHelperText } from '../FormHelperText'

const useStyles = makeStyles()((theme: Theme) => ({
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
  errorText: {
    alignItems: 'center',
    color: '#d63c42',
    display: 'flex',
    left: 5,
    top: 42,
    width: '100%',
  },
  helperTextTop: {
    color: theme.palette.cl.text.subTitle,
    marginTop: 0,
  },
  label: {
    fontFamily: 'sans-serif',
  },
}))

interface TextFieldPropsOverrides extends StandardTextFieldProps {
  label: string
}

interface KeyValueProps {
  title: string
  subTitle?: string
  keyLabel: string
  keyValue?: string
  keyDisabled?: boolean
  helperText?: string
  helperTextPosition?: 'bottom' | 'top'
  showLabel?: boolean
  valueLabel: string
  valueDisabled?: boolean
  addLabel?: string
  label?: string
  error?: boolean
  name: string
  keySize?: 'small' | 'medium' | 'large'
  valueSize?: 'small' | 'medium' | 'large'
  onlyValue?: boolean
  errorText?: string
}

export default function KeyValue(props: KeyValueProps) {
  const { classes, cx } = useStyles()
  const { control, register } = useFormContext()

  const {
    title,
    subTitle,
    keyLabel,
    valueLabel,
    addLabel,
    name,
    label,
    helperText,
    helperTextPosition,
    onlyValue,
    keyValue,
    keySize = 'medium',
    valueSize = 'medium',
    error,
    errorText,
    keyDisabled = false,
    showLabel = true,
    valueDisabled = false,
  } = props

  const [items, setItems] = useState([{ [keyLabel.toLowerCase()]: '', [valueLabel.toLowerCase()]: '' }])

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const handleAddItem = () => {
    console.log('FIELD ADDED')
    append(onlyValue ? '' : { [keyLabel.toLowerCase()]: '', [valueLabel.toLowerCase()]: '' })
  }
  console.log('ERROR', error)
  console.log('HELP', helperText)
  console.log('FIELDS', fields)

  const errorScrollClassName = 'error-for-scroll'
  return (
    <Box
      className={cx({
        [errorScrollClassName]: !!errorText,
      })}
    >
      <InputLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</InputLabel>
      {subTitle && <Typography sx={{ color: '#ABABAB' }}>{subTitle}</Typography>}

      {fields.map((item, index) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormRow spacing={10}>
            <TextField
              width={keySize}
              sx={{ color: '#B5B5BC' }}
              disabled={keyDisabled}
              value={keyValue}
              label={showLabel && index === 0 ? keyLabel : ''}
              {...(!onlyValue ? register(`${name}.${index}.${keyLabel.toLowerCase()}`) : {})}
            />
            <TextField
              width={valueSize}
              disabled={valueDisabled}
              label={showLabel && index === 0 ? valueLabel : ''}
              {...register(onlyValue ? `${name}.${index}` : `${name}.${index}.${valueLabel.toLowerCase()}`)}
            />
          </FormRow>
          {addLabel && (
            <IconButton sx={{ alignSelf: 'flex-end' }} onClick={() => remove(index)}>
              <Clear />
            </IconButton>
          )}
        </Box>
      ))}
      {addLabel && (
        <Button
          sx={{ fontSize: '10px', color: `${error ? 'red' : ''}` }}
          className={classes.addItemButton}
          onClick={handleAddItem}
        >
          <Add /> {addLabel}
        </Button>
      )}
      {errorText && (
        <FormHelperText
          className={cx({
            [classes.errorText]: true,
          })}
          data-qa-textfield-error-text={label}
          role='alert'
        >
          {errorText}
        </FormHelperText>
      )}
      {helperText && (helperTextPosition === 'bottom' || !helperTextPosition) && (
        <FormHelperText data-qa-textfield-helper-text>{helperText}</FormHelperText>
      )}
    </Box>
  )
}
