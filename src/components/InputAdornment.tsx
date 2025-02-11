import { InputAdornment as MuiInputAdornment } from '@mui/material/'
import React from 'react'

import type { InputAdornmentProps } from '@mui/material/InputAdornment'

/**
 * Use an InputAdornment to decorate a `<TextField />` with a prefix or suffix
 *
 * @example
 * <TextField
 *   label="Percentage"
 *   InputProps={{
 *     startAdornment: <InputAdornment position="end">%</InputAdornment>,
 *   }}
 * />
 */
export function InputAdornment(props: InputAdornmentProps) {
  return <MuiInputAdornment {...props} />
}
