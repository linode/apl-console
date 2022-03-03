import CheckboxIconChecked from '@mui/icons-material/CheckBox'
import CheckboxIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { Checkbox } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  determinate: {
    color: theme.palette.primary.main,
  },
  indeterminate: {
    color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.secondary,
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
}))

export default function ({ checked, disabled, indeterminate, ...other }: any) {
  const { classes } = useStyles()

  const indeterminateIcon = checked ? (
    <CheckboxIconChecked className={classes.indeterminate} />
  ) : (
    <CheckboxIcon className={classes.indeterminate} />
  )

  const className = disabled ? classes.disabled : classes[indeterminate ? 'indeterminate' : 'determinate']

  return (
    <Checkbox
      icon={<CheckboxIcon className={className} />}
      checkedIcon={<CheckboxIconChecked className={className} />}
      checked={checked}
      indeterminate={!disabled && indeterminate}
      indeterminateIcon={indeterminateIcon}
      disabled={disabled}
      {...other}
    />
  )
}
