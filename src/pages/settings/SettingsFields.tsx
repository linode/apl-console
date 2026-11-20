import { Box, Button } from '@mui/material'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { TextField } from 'components/forms/TextField'
import React, { useContext } from 'react'
import { Controller, FieldPath, useFormContext } from 'react-hook-form'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import YAML from 'yaml'
import { SettingsDisabledContext, SettingsId } from './SettingsForm'

type SettingsFieldPath = {
  [K in SettingsId]: FieldPath<NonNullable<GetSettingsApiResponse[K]>>
}[SettingsId]

interface TextProps {
  name: SettingsFieldPath
  label: string
  helperText?: string
  type?: 'text' | 'password'
  disabled?: boolean
  multiline?: boolean
}

export function SettingsTextField({ name, ...props }: TextProps) {
  const { control } = useFormContext()
  const disabled = useContext(SettingsDisabledContext)
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          disabled={disabled || props.disabled}
          value={field.value ?? ''}
          id={name}
          inputId={name}
          width='fullwidth'
          error={Boolean(fieldState.error)}
          errorText={fieldState.error?.message}
          autoComplete={props.type === 'password' ? 'new-password' : undefined}
        />
      )}
    />
  )
}

export function SettingsCheckbox({
  name,
  label,
  disabled,
}: {
  name: SettingsFieldPath
  label: string
  disabled?: boolean
}) {
  const { control } = useFormContext()
  const formDisabled = useContext(SettingsDisabledContext)
  return <ControlledCheckbox name={name} control={control} label={label} disabled={disabled || formDisabled} />
}

export function SettingsSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  const disabled = useContext(SettingsDisabledContext)
  return (
    <TextField
      select
      label={label}
      id={label.replace(/\s/g, '-').toLowerCase()}
      inputId={label.replace(/\s/g, '-').toLowerCase()}
      SelectProps={{ SelectDisplayProps: { 'aria-label': label } }}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      width='fullwidth'
    >
      {children}
    </TextField>
  )
}

export function SettingsStringList({
  name,
  label,
}: {
  name: 'zones' | 'domainFilters' | 'zoneIdFilters'
  label: string
}) {
  const { control } = useFormContext()
  const disabled = useContext(SettingsDisabledContext)
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field, fieldState }) => {
        const values: string[] = field.value ?? []
        return (
          <Box sx={{ mt: 2 }}>
            {values.map((value, index) => (
              // Entries can be duplicated and edited in place.
              // eslint-disable-next-line react/no-array-index-key
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  label={`${label} ${index + 1}`}
                  inputId={`${name}.${index}`}
                  id={`${name}.${index}`}
                  value={value}
                  disabled={disabled}
                  onChange={(event) =>
                    field.onChange(values.map((item, i) => (i === index ? event.target.value : item)))
                  }
                  error={Boolean(fieldState.error)}
                  errorText={fieldState.error?.message}
                  width='fullwidth'
                />
                <Button type='button' onClick={() => field.onChange(values.filter((_, i) => i !== index))}>
                  Remove {label} {index + 1}
                </Button>
              </Box>
            ))}
            <Button type='button' onClick={() => field.onChange([...values, ''])}>
              Add {label}
            </Button>
          </Box>
        )
      }}
    />
  )
}

export function SettingsYamlField({
  name,
  label,
}: {
  name: 'provider.other.external-dns' | 'provider.other.cert-manager'
  label: string
}) {
  const { control } = useFormContext()
  const disabled = useContext(SettingsDisabledContext)
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          label={label}
          inputId={name}
          id={name}
          value={typeof field.value === 'string' ? field.value : YAML.stringify(field.value ?? {})}
          multiline
          disabled={disabled}
          minRows={5}
          width='fullwidth'
          error={Boolean(fieldState.error)}
          errorText={fieldState.error?.message}
          onChange={(event) => field.onChange(event.target.value)}
        />
      )}
    />
  )
}
