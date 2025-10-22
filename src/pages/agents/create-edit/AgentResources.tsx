import React from 'react'
import { Box, Button, IconButton } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { Autocomplete } from 'components/forms/Autocomplete'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import font from 'theme/font'
import { Add, Clear } from '@mui/icons-material'
import { InputLabel } from 'components/InputLabel'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { FormHelperText } from 'components/FormHelperText'

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
    fontSize: '0.875rem',
    lineHeight: '1.5rem',
  },
  label: {
    fontFamily: 'sans-serif',
  },
}))

export interface AgentRouteItem {
  agent: string
  condition: string
  apiUrl: string
  apiKey?: string
}

export interface AgentToolItem {
  type: string
  name: string
  description: string
  apiUrl: string
  apiKey?: string
}

type AgentResourceItem = AgentRouteItem | AgentToolItem

interface AgentResourcesProps {
  title: string
  noMarginTop?: boolean
  helperText?: string
  helperTextPosition?: 'bottom' | 'top'
  showLabel?: boolean
  addLabel?: string
  label?: string
  error?: boolean
  name: string
  compressed?: boolean
  disabled?: boolean
  frozen?: boolean
  errorText?: string
  hideWhenEmpty?: boolean
  filterFn?: (item: any, index: number) => boolean
  mode: 'route' | 'tool' | 'knowledgeBase'
  toolType?: 'mcpServer' | 'subWorkflow' | 'function' | 'knowledgeBase'
  dropdownOptions?: string[]
  useDropdownForFirstField?: boolean
}

export default function AgentResources(props: AgentResourcesProps) {
  const { classes, cx } = useStyles()
  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()
  const [focusedApiKeyIndex, setFocusedApiKeyIndex] = React.useState<number | null>(null)

  const {
    title,
    noMarginTop = false,
    addLabel,
    disabled = false,
    frozen = false,
    name,
    label,
    helperText,
    helperTextPosition,
    error,
    errorText,
    showLabel = true,
    hideWhenEmpty = false,
    filterFn,
    mode,
    toolType,
    dropdownOptions = [],
    useDropdownForFirstField = false,
  } = props

  const { fields, append, remove } = useFieldArray({ control, name })
  const typedFields = fields as Array<AgentResourceItem & { id: string }>

  const mappedFields = typedFields.map((field, index) => ({ field, index }))
  const filteredFields = filterFn ? mappedFields.filter(({ field, index }) => filterFn(field, index)) : mappedFields

  if (filterFn && hideWhenEmpty && filteredFields.length === 0) return null

  const handleAddItem = () => {
    if (mode === 'route') append({ agent: '', condition: '', apiUrl: '', apiKey: '' })
    else if (mode === 'knowledgeBase') append({ type: 'knowledgeBase', name: '', description: '' })
    else append({ type: toolType, name: '', description: '', apiUrl: '', apiKey: '' })
  }

  const getFieldLabels = () => {
    if (mode === 'route') {
      return {
        field1: 'Agent',
        field2: 'Condition',
        field3: 'API URL',
        field4: 'API Key (optional)',
      }
    }
    if (mode === 'knowledgeBase') {
      return {
        field1: 'Knowledge base',
        field2: 'Description',
      }
    }
    return {
      field1: 'Name',
      field2: 'Description',
      field3: 'API URL',
      field4: 'API Key (optional)',
    }
  }

  const getFieldNames = () => {
    if (mode === 'route') {
      return {
        field1: 'agent',
        field2: 'condition',
        field3: 'apiUrl',
        field4: 'apiKey',
      }
    }
    if (mode === 'knowledgeBase') {
      return {
        field1: 'name',
        field2: 'description',
        field3: '',
        field4: '',
      }
    }
    return {
      field1: 'name',
      field2: 'description',
      field3: 'apiUrl',
      field4: 'apiKey',
    }
  }

  const getFieldCount = () => {
    if (mode === 'knowledgeBase') return 2
    return 4
  }

  const labels = getFieldLabels()
  const fieldNames = getFieldNames()
  const fieldCount = getFieldCount()

  const errorScrollClassName = 'error-for-scroll'
  return (
    <Box
      sx={{ mt: noMarginTop ? 0 : 3 }}
      className={cx({
        [errorScrollClassName]: !!errorText,
      })}
    >
      <InputLabel className={classes.inputLabel} sx={{ fontWeight: 'bold', fontSize: '14px', mb: '12px' }}>
        {title}
      </InputLabel>

      {/* Render label row for first item */}
      {showLabel && filteredFields.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              maxWidth: 'calc(100% - 40px)',
              gap: '10px',
            }}
          >
            <InputLabel className={classes.inputLabel} sx={{ width: '200px', fontSize: '14px' }}>
              {labels.field1}
            </InputLabel>
            <InputLabel className={classes.inputLabel} sx={{ width: '200px', fontSize: '14px' }}>
              {labels.field2}
            </InputLabel>
            {fieldCount >= 3 && (
              <InputLabel className={classes.inputLabel} sx={{ width: '200px', fontSize: '14px' }}>
                {labels.field3}
              </InputLabel>
            )}
            {fieldCount >= 4 && (
              <InputLabel className={classes.inputLabel} sx={{ width: '200px', fontSize: '14px' }}>
                {labels.field4}
              </InputLabel>
            )}
          </Box>
          <Box sx={{ width: '40px' }} /> {/* Spacer for delete button */}
        </Box>
      )}

      {filteredFields.map(({ field, index }) => {
        const getFieldError = (fieldName: string) => {
          const fieldPath = name.split('.')
          const errorObj = fieldPath.reduce((acc: any, path: string) => acc?.[path], errors)
          return errorObj?.[index]?.[fieldName]
        }

        const field1Error = getFieldError(fieldNames.field1)
        const field2Error = getFieldError(fieldNames.field2)
        const field3Error = fieldCount >= 3 ? getFieldError(fieldNames.field3) : null
        const field4Error = fieldCount >= 4 ? getFieldError(fieldNames.field4) : null

        const renderFirstField = () => {
          if (useDropdownForFirstField && dropdownOptions.length > 0) {
            return (
              <Autocomplete
                width='medium'
                placeholder=' '
                options={dropdownOptions}
                value={watch(`${name}.${index}.${fieldNames.field1}`) || null}
                onChange={(_, value) => {
                  setValue(`${name}.${index}.${fieldNames.field1}`, value || '')
                }}
                disabled={disabled || frozen}
                label=''
                hideLabel
                noMarginTop
                errorText={field1Error?.message?.toString()}
                helperText={field1Error?.message?.toString()}
              />
            )
          }
          return (
            <TextField
              {...register(`${name}.${index}.${fieldNames.field1}`)}
              width='medium'
              sx={{ color: '#B5B5BC' }}
              disabled={disabled}
              noMarginTop
              label=''
              error={!!field1Error}
              helperText={field1Error?.message?.toString()}
              InputProps={{
                readOnly: frozen,
              }}
            />
          )
        }

        return (
          <Box key={field.id} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                maxWidth: 'calc(100% - 40px)',
                gap: '10px',
              }}
            >
              {renderFirstField()}
              <TextField
                {...register(`${name}.${index}.${fieldNames.field2}`)}
                width='medium'
                sx={{ color: '#B5B5BC' }}
                disabled={disabled}
                noMarginTop
                label=''
                error={!!field2Error}
                helperText={field2Error?.message?.toString()}
                InputProps={{
                  readOnly: frozen,
                }}
              />
              {fieldCount >= 3 && (
                <TextField
                  {...register(`${name}.${index}.${fieldNames.field3}`)}
                  width='medium'
                  sx={{ color: '#B5B5BC' }}
                  disabled={disabled}
                  noMarginTop
                  label=''
                  error={!!field3Error}
                  helperText={field3Error?.message?.toString()}
                  InputProps={{
                    readOnly: frozen,
                  }}
                />
              )}
              {fieldCount >= 4 && (
                <TextField
                  {...register(`${name}.${index}.${fieldNames.field4}`)}
                  width='medium'
                  sx={{ color: '#B5B5BC' }}
                  disabled={disabled}
                  noMarginTop
                  label=''
                  error={!!field4Error}
                  helperText={field4Error?.message?.toString()}
                  type={focusedApiKeyIndex === index ? 'text' : 'password'}
                  onFocus={() => setFocusedApiKeyIndex(index)}
                  onBlur={() => setFocusedApiKeyIndex(null)}
                  InputProps={{
                    readOnly: frozen,
                  }}
                />
              )}
            </Box>
            {addLabel && !disabled && (
              <IconButton sx={{ alignSelf: 'flex-end' }} onClick={() => remove(index)}>
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
