import { FormControlLabelProps, FormHelperText } from '@mui/material'
import { MuiTelInput } from 'mui-tel-input'
import { Control, Controller, ControllerProps, FieldError, FieldValues, Path, useFormContext } from 'react-hook-form'

type Props<T> = {
  validation?: ControllerProps['rules']
  name: Path<T>
  parseError?: (error: FieldError) => string
  label?: FormControlLabelProps['label']
  helperText?: string
  control?: Control<T>
  disabled?: boolean
  required?: boolean
}

export default function RHFPhoneNumber<TFieldValues extends FieldValues>({
  name,
  disabled,
  validation = {},
  required,
  ...other
}: Props<TFieldValues>) {
  const { control } = useFormContext()
  if (required && !validation?.required) {
    validation.required = 'This field is required'
  }
  // @ts-ignore
  validation.disabled = disabled
  return (
    <Controller
      name={name}
      control={control}
      rules={validation}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <MuiTelInput
          value={`${value}`}
          onChange={onChange}
          onBlur={onBlur}
          error={!!error}
          required={required}
          helperText={
            <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
              {error?.message}
            </FormHelperText>
          }
          {...other}
        />
      )}
    />
  )
}
