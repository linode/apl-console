import CheckboxIconChecked from '@mui/icons-material/CheckBox'
import CheckboxIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import IndeterminateIcon from '@mui/icons-material/IndeterminateCheckBox'
import IndeterminateIconOutlined from '@mui/icons-material/IndeterminateCheckBoxOutlined'
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
  disabled: {
    color: theme.palette.grey[400],
  },
}))

export default function ({ checked, disabled, indeterminate, ...other }: any) {
  const { classes } = useStyles()

  const indeterminateIcon = checked ? (
    <IndeterminateIcon className={classes.indeterminate} />
  ) : (
    <IndeterminateIconOutlined className={classes.indeterminate} />
  )

  const className = disabled
    ? classes.disabled
    : classes[indeterminate || indeterminate === undefined ? 'indeterminate' : 'determinate']

  return (
    <Checkbox
      icon={<CheckboxIcon className={!disabled && classes.indeterminate} />}
      checkedIcon={<CheckboxIconChecked className={className} />}
      checked={checked}
      indeterminate={!disabled && indeterminate}
      indeterminateIcon={indeterminateIcon}
      disabled={disabled}
      {...other}
    />
  )
}
