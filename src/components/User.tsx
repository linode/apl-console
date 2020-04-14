/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { MenuItem, Select, IconButton, Typography, styled } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import React from 'react'
import { useSession } from '../session-context'
import { createClasses } from '../theme'
import Team from '../models/Team'

interface Props {
  teams: Team[]
}

const StyledSelect = styled(Select)({
  color: 'inherit',
})

// const StyledInputLabel = styled(InputLabel)({
//   color: 'inherit',
//   '&.Mui-focused': {
//     color: 'inherit',
//   },
// })
export default ({ teams = [] }: Props): any => {
  const classes = createClasses({
    avatar: {
      marginRight: '1vw',
    },
    select: {
      fontSize: '1.5rem',
    },
  })
  const { user, teamId, isAdmin, setTeamId } = useSession()
  const handleChange = (event): any => {
    setTeamId(event.target.value)
    event.preventDefault()
  }
  return (
    <>
      <IconButton color='inherit'>
        <Avatar className={classes.avatar} />
        <Typography variant='h5'>
          {user.email}&nbsp;({isAdmin ? `admin) obo team:` : `${teamId})`}
        </Typography>
      </IconButton>
      {isAdmin && (
        <StyledSelect value={teams.length ? teamId : ''} onChange={handleChange} className={classes.select}>
          <MenuItem value={undefined}>-</MenuItem>
          {teams.map(({ teamId: tid }): any => (
            <MenuItem key={tid} value={tid}>
              {tid.charAt(0).toUpperCase() + tid.substr(1)}
            </MenuItem>
          ))}
        </StyledSelect>
      )}
    </>
  )
}
