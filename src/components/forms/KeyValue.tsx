import React from 'react'
import { Box, Button, IconButton, StandardTextFieldProps } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import font from 'theme/font'
import { Add, Clear } from '@mui/icons-material'
import { Typography } from 'components/Typography'
import { InputLabel } from 'components/InputLabel'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import FormRow from 'components/forms/FormRow'
import { FormHelperText } from 'components/FormHelperText'
import { InputAdornment } from '../InputAdornment'
import { AutoResizableTextarea } from './TextArea'

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
  inputLabel: {
    color: theme.palette.cl.text.title,
    fontFamily: font.bold,
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: '1.5rem',
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

export interface KeyValueItem {
  name: string
  value: string
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
  // set to true when the value is a number field so only numbers can be parsed
  valueIsNumber?: boolean
  error?: boolean
  name: string
  // determines the margin-top between key/value pairs
  compressed?: boolean
  // disable all fields and remove buttons
  disabled?: boolean
  /**
   * Somewhat of an edge case to enable specific value fields where the rest of the value fields are disabled
   *  e.g. count quota in team settings page.
   */
  mutableValue?: Set<string>
  // used when section is disabled by checkbox, prevent user input but leaves styling untouched
  frozen?: boolean
  keySize?: 'small' | 'medium' | 'large'
  valueSize?: 'small' | 'medium' | 'large'
  onlyValue?: boolean
  hideKeyField?: boolean
  errorText?: string
  // optional filter function. It receives a field and its original index.
  filterFn?: (item: KeyValueItem & { id: string }, index: number) => boolean
  // hide filtered fields when filterFn is provided and empty
  hideWhenEmpty?: boolean
  decoratorMapping?: Record<string, string>
  // render the value field as a textarea when true
  isTextArea?: boolean
  isEncrypted?: boolean
  isValueOptional?: boolean
}

// This local subcomponent watches the key field (using its path) and checks the provided
// decoratorMapping. If a matching decorator exists, it is rendered as an InputAdornment.
function DecoratorAdornment({
  name,
  index,
  keyLabel,
  decoratorMapping,
  classes,
}: {
  name: string
  index: number
  keyLabel: string
  decoratorMapping: Record<string, string>
  classes: Record<string, string>
}) {
  const { control } = useFormContext()
  const keyFieldPath = `${name}.${index}.${keyLabel.toLowerCase()}`
  const keyValue = useWatch({ control, name: keyFieldPath }) as string
  const decorator = decoratorMapping[keyValue]
  if (!decorator) return null
  return (
    <InputAdornment className={classes.decorator} position='end'>
      <Typography className={classes.decoratortext}>{decorator}</Typography>
    </InputAdornment>
  )
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
    disabled = false,
    frozen = false,
    mutableValue,
    name,
    label,
    helperText,
    helperTextPosition,
    valueIsNumber,
    onlyValue,
    hideKeyField = false,
    keyValue,
    keySize = 'medium',
    valueSize = 'medium',
    error,
    errorText,
    keyDisabled = false,
    showLabel = true,
    valueDisabled = false,
    hideWhenEmpty = false,
    filterFn,
    decoratorMapping,
    isTextArea = false,
    isEncrypted,
    isValueOptional = false,
  } = props

  const { fields, append, remove } = useFieldArray({ control, name })
  // 'fields' parameter from 'useFieldArray' does not come with the correct type for some reason
  const typedFields = fields as Array<KeyValueItem & { id: string }>

  // Map fields with their original index.
  const mappedFields = typedFields.map((field, index) => ({ field, index }))
  // Apply filtering if filterFn is provided.
  const filteredFields = filterFn
    ? mappedFields.filter(({ field, index }) => filterFn(field as KeyValueItem & { id: string }, index))
    : mappedFields

  if (filterFn && hideWhenEmpty && filteredFields.length === 0) return null

  const handleAddItem = () => {
    append(onlyValue ? '' : { [keyLabel.toLowerCase()]: '', [valueLabel.toLowerCase()]: '' })
  }

  const errorScrollClassName = 'error-for-scroll'
  return (
    <Box
      sx={{ mt: 3 }}
      className={cx({
        [errorScrollClassName]: !!errorText,
      })}
    >
      <InputLabel className={classes.inputLabel} sx={{ fontWeight: 'bold', fontSize: '14px' }}>
        {title}
      </InputLabel>
      {subTitle && <Typography sx={{ color: '#ABABAB' }}>{subTitle}</Typography>}

      {filteredFields.map(({ field, index }, localIndex) => {
        const valuePath = onlyValue ? `${name}.${index}` : `${name}.${index}.${valueLabel.toLowerCase()}`
        const isFieldDisabled = mutableValue?.has(field.name) ? disabled : valueDisabled
        const commonProps = {
          ...register(valuePath),
          width: valueSize,
          label: showLabel && localIndex === 0 ? `${valueLabel}${isValueOptional ? ' (optional)' : ''}` : '',
          noMarginTop: compressed,
          disabled: isFieldDisabled,
          type: valueIsNumber ? 'number' : undefined,
          InputProps: {
            readOnly: frozen,
            endAdornment: decoratorMapping ? (
              <DecoratorAdornment
                name={name}
                index={index}
                keyLabel={keyLabel}
                decoratorMapping={decoratorMapping}
                classes={classes}
              />
            ) : null,
          },
        }

        const clearButtonMarginTop = () => {
          if (compressed) {
            if (localIndex === 0) return showLabel ? '32px' : '12px'
            if (isTextArea && !showLabel) return '4px'
            return showLabel ? '12px' : '14px'
          }

          return localIndex === 0 ? '48px' : '28px'
        }

        return (
          <Box key={field.id} sx={{ display: 'flex', alignItems: 'center' }}>
            <FormRow
              spacing={hideKeyField ? 0 : 10}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                maxWidth: 'calc(100% - 40px)',
              }}
            >
              {!hideKeyField && (
                <TextField
                  {...(!onlyValue ? register(`${name}.${index}.${keyLabel.toLowerCase()}`) : {})}
                  width={keySize}
                  sx={{ color: '#B5B5BC' }}
                  value={keyValue}
                  disabled={keyDisabled}
                  noMarginTop={compressed}
                  label={showLabel && localIndex === 0 ? keyLabel : ''}
                  hideLabel={localIndex !== 0 && isTextArea}
                  error={error}
                />
              )}
              <Box sx={{ flex: 1, mt: localIndex !== 0 && isTextArea && '-4px', width: '100%' }}>
                {isTextArea ? (
                  <Controller
                    name={valuePath}
                    control={control}
                    render={({ field }) => (
                      <AutoResizableTextarea {...commonProps} {...field} error={error} isEncrypted={isEncrypted} />
                    )}
                  />
                ) : (
                  <TextField {...commonProps} error={error} />
                )}
              </Box>
            </FormRow>
            {addLabel && !disabled && (
              <IconButton sx={{ alignSelf: 'flex-start', mt: clearButtonMarginTop() }} onClick={() => remove(index)}>
                <Clear />
              </IconButton>
            )}
          </Box>
        )
      })}
      {addLabel && !disabled && (
        <Button
          sx={{
            paddingLeft: '8px',
            fontSize: '10px',
            color: `${error ? 'red' : ''}`,
            ':hover': { backgroundColor: 'transparent' },
          }}
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
