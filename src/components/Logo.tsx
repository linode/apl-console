import React from 'react'
import { createClasses } from '../theme'

export default (): any => {
  const classes = createClasses({
    root: {
      marginRight: '1vw',
    },
  })
  return (
    <div className={classes.root}>
      <img src='/static/otomi_stack_medium.png' width='40' height='40' alt='otomi logo' />
    </div>
  )
}
