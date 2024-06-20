import { FieldValues } from 'react-hook-form'
import { TextFieldElement, TextFieldElementProps } from 'react-hook-form-mui'

export default function RHFTextField<TFieldValues extends FieldValues>({
  disabled,
  validation = {},
  ...other
}: TextFieldElementProps<TFieldValues>) {
  // @ts-ignore
  validation.disabled = disabled
  return <TextFieldElement validation={validation} disabled={disabled} {...other} />
}
