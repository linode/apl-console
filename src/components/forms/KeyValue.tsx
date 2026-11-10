import AddIcon from '@mui/icons-material/Add'
import { Clear } from '@mui/icons-material'
import { Box, Button, IconButton } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { TextField } from 'components/forms/TextField'
import { Typography } from 'components/Typography'
import { InputLabel } from 'components/InputLabel'
import { FormHelperText } from 'components/FormHelperText'
import { InputAdornment } from '../InputAdornment'
import { AutoResizableTextarea } from './TextArea'

// ----------------------------------------------------------------------

const FIELD_GAP = 20
const BUTTON_GAP = 10
const BUTTON_WIDTH = 40

// Matches the actual maximum width of the custom TextField.
// TextField.tsx uses 420px for 'large', but its input
// has a maxWidth of 416px.
const FIELD_WIDTHS = {
  small: 100,
  medium: 200,
  large: 416,
}

// ----------------------------------------------------------------------

const useStyles = makeStyles()((theme: Theme) => ({
  errorText: {
    alignItems: 'center',
    color: theme.palette.error.main,
    display: 'flex',
    left: 5,
    top: 42,
    width: '100%',
  },
  inputLabel: {
    color: theme.palette.text.primary,
    fontFamily: theme.font.bold,
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  decorator: {
    borderLeft: `1px solid ${theme.palette.divider}`,
    height: 'auto',
    padding: '7px',
    width: '65px',
    textAlign: 'right',
    backgroundColor: theme.palette.cm.disabledBackground,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  decoratortext: {
    fontFamily: theme.font.bold,
    fontWeight: 700,
    fontSize: '10px',
    color: theme.palette.text.secondary,
  },
}))

// ----------------------------------------------------------------------

export interface KeyValueItem {
  name: string
  value: string
}

interface KeyValueProps {
  title?: string
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
  noMarginTop?: boolean
  valueIsNumber?: boolean
  error?: boolean
  name: string
  compressed?: boolean
  disabled?: boolean
  mutableValue?: Set<string>
  frozen?: boolean
  keySize?: 'small' | 'medium' | 'large'
  valueSize?: 'small' | 'medium' | 'large'
  onlyValue?: boolean
  hideKeyField?: boolean
  errorText?: string
  filterFn?: (item: KeyValueItem & { id: string }, index: number) => boolean
  hideWhenEmpty?: boolean
  decoratorMapping?: Record<string, string>
  isTextArea?: boolean
  isEncrypted?: boolean
  isValueOptional?: boolean
}

// ----------------------------------------------------------------------

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

  const keyValue = useWatch({
    control,
    name: keyFieldPath,
  }) as string

  const decorator = decoratorMapping[keyValue]

  if (!decorator) return null

  return (
    <InputAdornment className={classes.decorator} position='end'>
      <Typography className={classes.decoratortext}>{decorator}</Typography>
    </InputAdornment>
  )
}

// ----------------------------------------------------------------------

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
    noMarginTop,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const typedFields = fields as Array<KeyValueItem & { id: string }>

  const mappedFields = typedFields.map((field, index) => ({
    field,
    index,
  }))

  const filteredFields = filterFn ? mappedFields.filter(({ field, index }) => filterFn(field, index)) : mappedFields

  if (filterFn && hideWhenEmpty && filteredFields.length === 0) return null

  const handleAddItem = () => {
    append(
      onlyValue
        ? ''
        : {
            [keyLabel.toLowerCase()]: '',
            [valueLabel.toLowerCase()]: '',
          },
    )
  }

  const keyWidth = FIELD_WIDTHS[keySize]
  const valueWidth = FIELD_WIDTHS[valueSize]

  const fieldsMaxWidth = hideKeyField ? valueWidth : keyWidth + FIELD_GAP + valueWidth

  return (
    <Box
      sx={{
        mt: noMarginTop ? 0 : 3,
        width: '100%',
        minWidth: 0,
        containerType: 'inline-size',
      }}
      className={cx({
        'error-for-scroll': !!errorText,
      })}
    >
      {title && (
        <InputLabel
          className={classes.inputLabel}
          sx={{
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          {title}
        </InputLabel>
      )}

      {subTitle && (
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          {subTitle}
        </Typography>
      )}

      {filteredFields.map(({ field, index }, localIndex) => {
        const valuePath = onlyValue ? `${name}.${index}` : `${name}.${index}.${valueLabel.toLowerCase()}`

        const isFieldDisabled = mutableValue?.has(field.name) ? disabled : valueDisabled

        const hasVisibleLabel = showLabel && localIndex === 0
        const hasRemoveButton = Boolean(addLabel && !disabled)

        const commonProps = {
          ...register(valuePath),
          width: 'fullwidth' as const,
          label: hasVisibleLabel ? `${valueLabel}${isValueOptional ? ' (optional)' : ''}` : '',
          noMarginTop: true,
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

        return (
          <Box
            key={field.id}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: `${BUTTON_GAP}px`,
              width: '100%',
              minWidth: 0,
              mb: compressed ? 1 : 2,
            }}
          >
            <Box
              sx={{
                display: 'grid',

                // Columns follow the real field widths rather
                // than distributing unused space.
                gridTemplateColumns: hideKeyField
                  ? 'minmax(0, 1fr)'
                  : `minmax(0, ${keyWidth}fr) minmax(0, ${valueWidth}fr)`,

                columnGap: `${FIELD_GAP}px`,
                rowGap: 1,
                alignItems: 'start',

                flex: `0 1 ${fieldsMaxWidth}px`,
                width: '100%',
                maxWidth: `${fieldsMaxWidth}px`,
                minWidth: 0,

                // Stack fields when the actual form container
                // becomes narrow, independently of viewport width.
                '@container (max-width: 600px)': {
                  gridTemplateColumns: 'minmax(0, 1fr)',
                },
              }}
            >
              {!hideKeyField && (
                <Box
                  sx={{
                    width: '100%',
                    minWidth: 0,
                    maxWidth: '100%',
                    '& > *': {
                      width: '100%',
                      maxWidth: '100%',
                    },
                  }}
                >
                  <TextField
                    {...(!onlyValue ? register(`${name}.${index}.${keyLabel.toLowerCase()}`) : {})}
                    width='fullwidth'
                    sx={{
                      width: '100%',
                      color: 'text.secondary',
                    }}
                    value={keyValue}
                    disabled={keyDisabled}
                    noMarginTop
                    label={hasVisibleLabel ? keyLabel : ''}
                    hideLabel={!hasVisibleLabel}
                    error={error}
                  />
                </Box>
              )}

              <Box
                sx={{
                  width: '100%',
                  minWidth: 0,
                  maxWidth: '100%',

                  '& > *': {
                    width: '100%',
                    maxWidth: '100%',
                  },

                  '& .MuiFormControl-root': {
                    width: '100%',
                    maxWidth: '100%',
                  },

                  // AutoResizableTextarea normally applies
                  // minWidth: 400px and adjusts width inline.
                  // Override only its horizontal sizing here
                  // so it follows the same responsive column
                  // dimensions as TextField.
                  '& textarea': {
                    boxSizing: 'border-box',
                    width: '100% !important',
                    minWidth: '0 !important',
                    maxWidth: '100% !important',
                    resize: 'vertical',
                  },
                }}
              >
                {isTextArea ? (
                  <Controller
                    name={valuePath}
                    control={control}
                    render={({ field: controllerField }) => (
                      <AutoResizableTextarea
                        {...commonProps}
                        {...controllerField}
                        error={error}
                        isEncrypted={isEncrypted}
                      />
                    )}
                  />
                ) : (
                  <TextField {...commonProps} hideLabel={!hasVisibleLabel} error={error} />
                )}
              </Box>
            </Box>

            {hasRemoveButton && (
              <IconButton
                sx={{
                  flex: `0 0 ${BUTTON_WIDTH}px`,
                  width: `${BUTTON_WIDTH}px`,
                  height: `${BUTTON_WIDTH}px`,
                  alignSelf: 'flex-start',
                  mt: hasVisibleLabel ? 3 : 0.5,
                  borderRadius: '1px',
                }}
                onClick={() => remove(index)}
              >
                <Clear />
              </IconButton>
            )}
          </Box>
        )
      })}

      {addLabel && !disabled && (
        <Button
          sx={{
            mt: 2,
            borderRadius: '1px',
          }}
          type='button'
          variant='outlined'
          startIcon={<AddIcon />}
          onClick={handleAddItem}
        >
          {addLabel}
        </Button>
      )}

      {errorText && (
        <FormHelperText className={cx(classes.errorText)} data-qa-textfield-error-text={label} role='alert'>
          {errorText}
        </FormHelperText>
      )}

      {helperText && (helperTextPosition === 'bottom' || !helperTextPosition) && (
        <FormHelperText data-qa-textfield-helper-text>{helperText}</FormHelperText>
      )}
    </Box>
  )
}
