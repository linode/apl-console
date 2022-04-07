import { Link } from '@mui/material'
import React from 'react'
import { useMainStyles } from 'common/theme'

export default function (props): React.ReactElement {
  const { classes } = useMainStyles()
  return <Link {...props} className={classes.selectable} />
}
