import Avatar from '@material-ui/core/Avatar'
import React from 'react'
import { useSession } from '../session-context'
import { createClasses } from '../theme'

export default (): any => {
  const classes = createClasses({
    root: {
      marginRight: '1vw',
    },
  })
  const { user, team, changeSession } = useSession()
  return (
    <>
      <Avatar className={classes.root} />
      <span onClick={changeSession}>{`${user.email} (${team.name})`}</span>
    </>
  )
}
