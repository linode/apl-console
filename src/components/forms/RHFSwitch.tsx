import { FieldValues } from 'react-hook-form'
import { SwitchElement, SwitchElementProps } from 'react-hook-form-mui'

export default function RHFSwitch<TFieldValues extends FieldValues>({ ...other }: SwitchElementProps<TFieldValues>) {
  return <SwitchElement {...other} />
}
