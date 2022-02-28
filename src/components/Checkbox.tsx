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
    color: theme.palette.grey[600],
  },
}))

export default function ({ checked, disabled, indeterminate, ...other }: any) {
  const { classes } = useStyles()

  const indeterminateIcon = checked ? (
    <CheckboxIconChecked className={classes.indeterminate} />
  ) : (
    <CheckboxIcon className={classes.indeterminate} />
  )

  const className = disabled ? '' : classes[indeterminate ? 'indeterminate' : 'determinate']

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
