import { Link, LinkProps } from '@mui/material'
import React from 'react'

export default function ({ ...other }: LinkProps): React.ReactElement {
  return <Link {...other} />
}
