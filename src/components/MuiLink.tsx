import { Link, LinkProps } from '@mui/material'
import { useMainStyles } from 'common/theme'
import React from 'react'

export default function ({ type, ...other }: LinkProps): React.ReactElement {
  const { classes } = useMainStyles()
  return <Link {...other} className={classes.selectable} />
}
