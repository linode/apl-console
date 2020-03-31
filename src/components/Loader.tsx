import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import { createClasses } from '../theme'

export default (): any => {
  const classes = createClasses({
    root: {
      minWidth: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
    },
  })
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}
