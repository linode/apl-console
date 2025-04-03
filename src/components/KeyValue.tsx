import React, { useState } from 'react'
import { Box, Button, IconButton, StandardTextFieldProps } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { Add, Clear } from '@mui/icons-material'
import { Typography } from 'components/Typography'
import { InputLabel } from 'components/InputLabel'
import { useFieldArray, useFormContext } from 'react-hook-form'
import FormRow from 'components/forms/FormRow'
import { FormHelperText } from 'components/FormHelperText'
import { InputAdornment } from './InputAdornment'

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
  decorator: {
    borderLeft: '1px solid #777777',
    height: 'auto',
    padding: '7px',
    width: '65px',
    textAlign: 'right',
    backgroundColor: theme.palette.cm.disabledBackground,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  decoratortext: {
    fontWeight: 'bold',
    fontSize: '10px',
    color: theme.palette.cl.text.title,
  },
}))

interface TextFieldPropsOverrides extends StandardTextFieldProps {
  label: string
}

interface KeyValueItem {
  key: string
  value: string
  mutable?: boolean
  // preferably not longer than 5 characters
  decorator?: string
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
  // determines the margin-top between key/value pairs
  compressed?: boolean
  // used when section is disabled by checkbox, prevent user input but leaves styling untouched
  frozen?: boolean
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
    compressed = false,
    frozen = false,
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
    append(onlyValue ? '' : { [keyLabel.toLowerCase()]: '', [valueLabel.toLowerCase()]: '' })
  }

  const errorScrollClassName = 'error-for-scroll'
  return (
    <Box
      className={cx({
        [errorScrollClassName]: !!errorText,
      })}
    >
      <InputLabel sx={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</InputLabel>
      {subTitle && <Typography sx={{ color: '#ABABAB' }}>{subTitle}</Typography>}

      {(fields as (KeyValueItem & { id: string })[]).map((item, index) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormRow spacing={10}>
            <TextField
              width={keySize}
              sx={{ color: '#B5B5BC' }}
              disabled={keyDisabled}
              value={keyValue}
              noMarginTop={compressed}
              label={showLabel && index === 0 ? keyLabel : ''}
              error={error}
              {...(!onlyValue ? register(`${name}.${index}.${keyLabel.toLowerCase()}`) : {})}
            />
            <TextField
              width={valueSize}
              /**
               *  First check if item is mutable, this has priorty over the valueDisabled prop
               *  If the item is mutable and valueDisable is true, then the item will still be enabled
               * */
              disabled={!(item.mutable ?? !valueDisabled)}
              label={showLabel && index === 0 ? valueLabel : ''}
              noMarginTop={compressed}
              {...register(onlyValue ? `${name}.${index}` : `${name}.${index}.${valueLabel.toLowerCase()}`)}
              InputProps={{
                ...{ readOnly: frozen },
                endAdornment: item.decorator ? (
                  <InputAdornment className={classes.decorator} position='end'>
                    <Typography className={classes.decoratortext}>{item.decorator}</Typography>
                  </InputAdornment>
                ) : null,
              }}
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
