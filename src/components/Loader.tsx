import { Box, Container } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import { createClasses } from '../theme'

export default (): any => {
  const classes = createClasses({
    root: {
      minHeight: '100vh',
    },
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <CircularProgress />
    </div>
  )
}
