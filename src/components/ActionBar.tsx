import AppBar from '@mui/material/AppBar'
import React, { ComponentType } from 'react'

interface Props {
  children: ComponentType
}

export default function ({ children }: Props): React.ReactElement {
  return <AppBar>{children}</AppBar>
}
