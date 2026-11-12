import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import { cloneDeep, get, isEqual, set } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { sentenceCase } from 'utils/data'
import YAML from 'yaml'
import { SettingsSchema, asSchema, defaultsForSchema, mergeSchemas, selectedOption } from './schema'

export type FieldPath = Array<string | number>

export interface SettingFieldProps {
  schema: SettingsSchema
  value: unknown
  path: FieldPath
  required?: boolean
  disabled?: boolean
  hiddenPaths: string[]
  disabledPaths: string[]
  errors: Record<string, string[]>
  onChange: (path: FieldPath, value: unknown) => void
  onEditorError: (path: string, error?: string) => void
}

const fieldKey = (path: FieldPath) => path.join('.')
const labelFor = (schema: SettingsSchema, path: FieldPath) =>
  schema.title || sentenceCase(String(path[path.length - 1]))

function ObjectEditor({
  value,
  label,
  disabled,
  onChange,
  onError,
}: {
  value: unknown
  label: string
  disabled: boolean
  onChange: (value: unknown) => void
  onError: (error?: string) => void
}) {
  const [text, setText] = useState(() => YAML.stringify(value ?? {}))
  const [error, setError] = useState('')
  const lastValue = useRef(value)
  useEffect(() => {
    if (isEqual(value, lastValue.current)) return
    lastValue.current = value
    setText(YAML.stringify(value ?? {}))
    setError('')
    onError(undefined)
  }, [value])
  useEffect(() => () => onError(undefined), [])
  return (
    <TextField
      fullWidth
      multiline
      minRows={5}
      label={label}
      value={text}
      disabled={disabled}
      error={Boolean(error)}
      helperText={error}
      onChange={(event) => {
        const next = event.target.value
        setText(next)
        try {
          const parsed = YAML.parse(next)
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Enter a YAML object')
          lastValue.current = parsed
          setError('')
          onError(undefined)
          onChange(parsed)
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Invalid YAML'
          setError(message)
          onError(message)
        }
      }}
    />
  )
}

export default function SettingField(props: SettingFieldProps): React.ReactElement {
  const { value, path, required, hiddenPaths, disabledPaths, errors, onChange, onEditorError } = props
  let schema = mergeSchemas(props.schema)
  const key = fieldKey(path)
  if (schema['x-hidden'] || hiddenPaths.includes(key)) return null
  const disabled = props.disabled || schema.readOnly || disabledPaths.includes(key)
  const label = labelFor(schema, path)
  const fieldErrors = errors[key] ?? []
  const update = (next: unknown) => onChange(path, next)
  const child = (childSchema: SettingsSchema, childValue: unknown, childPath: FieldPath, childRequired = false) => (
    <SettingField
      {...props}
      key={fieldKey(childPath)}
      schema={childSchema}
      value={childValue}
      path={childPath}
      required={childRequired}
      disabled={disabled}
    />
  )
  const help = fieldErrors.length ? fieldErrors.join(', ') : schema.description

  if (schema.oneOf) {
    const options = schema.oneOf.map(asSchema)
    const selected = selectedOption(schema, value)
    const option = options[selected]
    const { oneOf: _oneOf, ...base } = schema
    schema = mergeSchemas({ ...base, allOf: [option] })
    const selectOption = (index: number) => {
      const nextOption = options[index]
      if (nextOption.nullable && !Object.keys(nextOption.properties ?? {}).length) {
        update(null)
        return
      }
      const initial: Record<string, unknown> = {}
      Object.entries(nextOption.properties ?? {}).forEach(([name, definition]) => {
        const property = mergeSchemas(asSchema(definition))
        if (property.properties) initial[name] = {}
      })
      update(defaultsForSchema(nextOption, initial) ?? {})
    }
    return (
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          fullWidth
          label={label}
          value={selected}
          disabled={disabled}
          helperText={help}
          error={Boolean(fieldErrors.length)}
          onChange={(event) => selectOption(Number(event.target.value))}
        >
          {options.map((item, index) => (
            <MenuItem key={item.title || index} value={index}>
              {item.title || `Option ${index + 1}`}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ mt: 2 }}>{child(schema, value, path)}</Box>
      </Box>
    )
  }

  if (schema.properties) {
    const objectValue = value && typeof value === 'object' && !Array.isArray(value) ? value : {}
    return (
      <Box sx={{ mb: 2, pl: path.length ? 2 : 0, borderLeft: path.length ? '1px solid' : 0, borderColor: 'divider' }}>
        {path.length > 0 && !schema['x-hideTitle'] && <Typography variant='h6'>{label}</Typography>}
        {path.length > 0 && schema.description && (
          <Typography variant='body2' sx={{ mb: 1 }}>
            {schema.description}
          </Typography>
        )}
        {fieldErrors.map((error) => (
          <FormHelperText error key={error}>
            {error}
          </FormHelperText>
        ))}
        {Object.entries(schema.properties).map(([name, definition]) =>
          child(asSchema(definition), get(objectValue, [name]), [...path, name], schema.required?.includes(name)),
        )}
      </Box>
    )
  }

  if (schema.type === 'object') {
    return (
      <Box sx={{ mb: 2 }}>
        <ObjectEditor
          label={label}
          value={value}
          disabled={Boolean(disabled)}
          onChange={update}
          onError={(error) => onEditorError(key, error)}
        />
      </Box>
    )
  }

  if (schema.type === 'array') {
    if (!schema.items || Array.isArray(schema.items)) throw new Error(`Unsupported array schema at ${key}`)
    const itemSchema = asSchema(schema.items)
    const values = Array.isArray(value) ? value : []
    if (itemSchema.enum && schema.uniqueItems) {
      return (
        <FormControl component='fieldset' disabled={disabled} error={Boolean(fieldErrors.length)} sx={{ mb: 2 }}>
          <FormLabel component='legend'>{label}</FormLabel>
          <FormGroup row>
            {itemSchema.enum.map((item) => (
              <FormControlLabel
                key={String(item)}
                label={String(item)}
                control={
                  <Checkbox
                    checked={values.includes(item)}
                    onChange={(event) =>
                      update(
                        event.target.checked ? [...values, item] : values.filter((entry) => !isEqualValue(entry, item)),
                      )
                    }
                  />
                }
              />
            ))}
          </FormGroup>
          {help && <FormHelperText>{help}</FormHelperText>}
        </FormControl>
      )
    }
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant='h6'>{label}</Typography>
        {help && <FormHelperText error={Boolean(fieldErrors.length)}>{help}</FormHelperText>}
        {values.map((entry, index) => (
          // Array entries may have duplicate and editable values.
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index} sx={{ display: 'flex', alignItems: 'start', gap: 1, mt: 1 }}>
            <Box sx={{ flex: 1 }}>{child(itemSchema, entry, [...path, index])}</Box>
            <IconButton
              aria-label={`Remove ${label} ${index + 1}`}
              disabled={disabled}
              onClick={() => update(values.filter((_, i) => i !== index))}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          type='button'
          disabled={disabled}
          onClick={() => {
            const initial = itemSchema.type === 'string' ? '' : {}
            update([...values, defaultsForSchema(itemSchema, initial)])
          }}
        >
          Add {label}
        </Button>
      </Box>
    )
  }

  if (schema.type === 'boolean') {
    return (
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          label={label}
          control={
            <Checkbox checked={value === true} disabled={disabled} onChange={(event) => update(event.target.checked)} />
          }
        />
        {help && <FormHelperText error={Boolean(fieldErrors.length)}>{help}</FormHelperText>}
      </Box>
    )
  }

  if (schema.enum && schema.enum.length <= 7 && schema.enum.length > 1) {
    return (
      <FormControl
        component='fieldset'
        required={required}
        disabled={disabled}
        error={Boolean(fieldErrors.length)}
        sx={{ mb: 2 }}
      >
        <FormLabel component='legend'>{label}</FormLabel>
        <RadioGroup row value={value ?? ''} onChange={(_, next) => update(next)}>
          {!required && schema.default === undefined && <FormControlLabel value='' control={<Radio />} label='Off' />}
          {schema.enum.map((item) => (
            <FormControlLabel key={String(item)} value={item} control={<Radio />} label={String(item)} />
          ))}
        </RadioGroup>
        {help && <FormHelperText>{help}</FormHelperText>}
      </FormControl>
    )
  }

  if (schema.enum?.length === 1 && schema.default !== undefined) return null
  const isNumber = schema.type === 'integer' || schema.type === 'number'
  let inputType = 'text'
  if (isNumber) inputType = 'number'
  else if (schema['x-secret'] !== undefined && !schema['x-decrypt']) inputType = 'password'
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        select={Boolean(schema.enum)}
        label={label}
        required={required}
        disabled={disabled}
        value={value ?? ''}
        type={inputType}
        multiline={schema['x-formtype'] === 'textarea'}
        minRows={schema['x-formtype'] === 'textarea' ? 4 : undefined}
        placeholder={schema['x-default']}
        error={Boolean(fieldErrors.length)}
        helperText={help}
        onChange={(event) =>
          update(isNumber && event.target.value !== '' ? Number(event.target.value) : event.target.value)
        }
      >
        {schema.enum?.map((item) => (
          <MenuItem key={String(item)} value={String(item)}>
            {String(item)}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}

const isEqualValue = (left: unknown, right: unknown) => left === right

export const updateSettingValue = (data: Record<string, unknown>, path: FieldPath, value: unknown) =>
  path.length ? set(cloneDeep(data), path, value) : (value as Record<string, unknown>)
