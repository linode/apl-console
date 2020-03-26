import Avatar from '@material-ui/core/Avatar'
import React from 'react'
import { Link } from 'react-router-dom'
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
      <a onClick={changeSession}>{`${user.email} (${team.name})`}</a>
    </>
  )
}
