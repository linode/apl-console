import { FormHelperText as MuiFormHelperText } from '@mui/material'
import React from 'react'

import type { FormHelperTextProps } from '@mui/material/FormHelperText'

/**
 * A `<FormHelperText />` provides helper text to an input.
 */
export function FormHelperText(props: FormHelperTextProps) {
  return <MuiFormHelperText {...props} />
}
