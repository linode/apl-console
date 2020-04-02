import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import { createClasses } from '../theme'

export default (): any => {
  const classes = createClasses({
    root: {
      display: 'flex',
      justifyContent: 'center',
    },
  })
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}
