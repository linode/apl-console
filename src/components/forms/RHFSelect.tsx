import { FieldValues } from 'react-hook-form'
import { MultiSelectElement, MultiSelectElementProps, SelectElement, SelectElementProps } from 'react-hook-form-mui'

export function RHFSelect<TFieldValues extends FieldValues>({
  disabled,
  validation = {},
  ...other
}: SelectElementProps<TFieldValues>) {
  // @ts-ignore
  validation.disabled = disabled
  return <SelectElement disabled={disabled} validation={validation} {...other} />
}

export function RHFMultiSelect<TFieldValues extends FieldValues>({
  disabled,
  validation,
  ...other
}: MultiSelectElementProps<TFieldValues>) {
  // @ts-ignore
  validation.disabled = disabled
  return <MultiSelectElement disabled={disabled} validation={validation} {...other} />
}
