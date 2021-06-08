import React from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'

export type TextAreaProps = TextFieldProps & {
  rows: number
  rowsMax: number
}

export default ({ value, rows, rowsMax }: TextAreaProps): React.ReactElement => {
  return (
    <TextField
      fullWidth
      multiline
      rows={rows || 4}
      rowsMax={rowsMax || 4}
      autoComplete='off'
      variant='outlined'
      value={value}
      label='string'
    />
  )
}
