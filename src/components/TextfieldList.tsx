import React from 'react'
import { Box, Button, IconButton } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { Add, Clear } from '@mui/icons-material'
import { Typography } from 'components/Typography'
import { InputLabel } from 'components/InputLabel'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { FormHelperText } from 'components/FormHelperText'

const useStyles = makeStyles()((theme: Theme) => ({
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
  errorText: {
    alignItems: 'center',
    color: theme.palette.error.main,
    display: 'flex',
    left: 5,
    top: 42,
    width: '100%',
  },
  helperTextTop: {
    color: theme.palette.text.secondary,
    marginTop: 0,
  },
  label: {
    fontFamily: theme.font.normal,
    fontWeight: 400,
  },
}))

interface ValueListProps {
  title: string
  subTitle?: string
  /** The label shown on the input (only on the first item if showLabel is true) */
  valueLabel: string
  helperText?: string
  helperTextPosition?: 'bottom' | 'top'
  /** Whether to display the label above the first text field */
  showLabel?: boolean
  /** The label for the add/remove button */
  addLabel?: string
  error?: boolean
  errorText?: string
  /** Name for the react-hook-form field array */
  name: string
  /** Determines the width of the text field: small, medium, or large */
  valueSize?: 'small' | 'medium' | 'large'
  valueDisabled?: boolean
}

export default function TextfieldList(props: ValueListProps) {
  const { classes, cx } = useStyles()
  const { control, register } = useFormContext()

  const {
    title,
    subTitle,
    valueLabel,
    addLabel,
    name,
    helperText,
    helperTextPosition,
    showLabel = true,
    valueSize = 'medium',
    error,
    errorText,
    valueDisabled = false,
  } = props

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const handleAddItem = () => {
    append('')
  }

  const errorScrollClassName = 'error-for-scroll'
  return (
    <Box
      className={cx({
        [errorScrollClassName]: !!errorText,
      })}
    >
      <InputLabel sx={(theme) => ({ fontFamily: theme.font.bold, fontWeight: 700, fontSize: '14px' })}>
        {title}
      </InputLabel>
      {subTitle && <Typography sx={{ color: 'text.secondary' }}>{subTitle}</Typography>}

      {fields.map((item, index) => (
        <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <TextField
            width={valueSize}
            disabled={valueDisabled}
            label={showLabel && index === 0 ? valueLabel : ''}
            {...register(`${name}.${index}`)}
          />
          {addLabel && (
            <IconButton sx={{ alignSelf: 'flex-end', borderRadius: '1px' }} onClick={() => remove(index)}>
              <Clear />
            </IconButton>
          )}
        </Box>
      ))}
      {addLabel && (
        <Button
          sx={{ fontSize: '10px', color: error ? 'error.main' : undefined }}
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
          role='alert'
        >
          {errorText}
        </FormHelperText>
      )}
      {helperText && (helperTextPosition === 'bottom' || !helperTextPosition) && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </Box>
  )
}
