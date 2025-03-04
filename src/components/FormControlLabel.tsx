import { FormControlLabel as MuiFormControlLabel } from '@mui/material'
import React from 'react'

import type { FormControlLabelProps } from '@mui/material/FormControlLabel'

/**
 * A `<FormControlLabel />` is used to label components such as Radios, Checkboxes, or Switches.
 *
 * @example
 * <FormControlLabel
 *   control={<Checkbox />}
 *   label="This is a FormControlLabel"
 *   onChange={() => {}}
 * />
 */
export function FormControlLabel(props: FormControlLabelProps) {
  return <MuiFormControlLabel {...props} />
}
