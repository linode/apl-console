import React, { ComponentType } from 'react'
import AppBar from '@mui/material/AppBar'

interface Props {
  children: ComponentType
}

export default ({ children }: Props): React.ReactElement => {
  return <AppBar>{children}</AppBar>
}
