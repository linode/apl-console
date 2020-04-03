import { MenuItem, Select } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import React from 'react'
import { useSession } from '../session-context'
import { createClasses } from '../theme'

export default ({ teams = null }): any => {
  const classes = createClasses({
    root: {
      marginRight: '1vw',
    },
  })
  const { user, teamId, isAdmin, changeSession } = useSession()
  const handleChange = (event): any => {
    changeSession(true, event.target.value)
    event.preventDefault()
  }
  return (
    <>
      <Avatar className={classes.root} />
      <span onClick={(): any => changeSession(false)}>{user.email}</span> &nbsp;({isAdmin && `admin, obo:`}
      {isAdmin && (
        <Select onChange={handleChange}>
          <MenuItem value={teamId}>-</MenuItem>
          {teams !== null &&
            teams.map(({ name: tid }): any => (
              <MenuItem key={tid} value={tid}>
                {tid.charAt(0).toUpperCase() + tid.substr(1)}
              </MenuItem>
            ))}
        </Select>
      )}
      {!isAdmin && teamId}
      {')'}
    </>
  )
}
