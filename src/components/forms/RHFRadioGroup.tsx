import { RadioButtonGroup, RadioButtonGroupProps } from 'react-hook-form-mui'
import { FieldValues } from 'react-hook-form'

export default function RHFRadioGroup<TFieldValues extends FieldValues>({
  ...other
}: RadioButtonGroupProps<TFieldValues>) {
  return <RadioButtonGroup {...other} />
}
