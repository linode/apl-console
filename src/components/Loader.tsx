import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'
import { createClasses } from '../theme'

export default (): React.ReactElement => {
  const classes = createClasses({
    root: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
    },
  })
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}
