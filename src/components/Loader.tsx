import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { makeStyles } from 'common/theme'

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
})

export default () => {
  const { classes } = useStyles()
  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  )
}
