import { MenuItem, Select, Typography, Hidden } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSession } from '../session-context'
import { Team } from '../models'

interface Props {
  teams: Team[]
}

const useStyles = makeStyles(theme => ({
  avatar: {
    marginRight: 10,
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  select: {
    marginLeft: 10,
    fontSize: '1rem',
  },
}))

export default ({ teams = [] }: Props): any => {
  const classes = useStyles()
  const {
    user: { email, teamId, isAdmin },
    oboTeamId,
    setOboTeamId,
  } = useSession()

  const handleChange = (event): any => {
    setOboTeamId(event.target.value)
    event.preventDefault()
  }
  return (
    <>
      <Avatar className={classes.avatar} />
      <Hidden xsDown>
        <Typography variant='body1'>
          {email} <strong>({isAdmin ? `admin) obo team:` : `${teamId})`}</strong>
        </Typography>
      </Hidden>
      {isAdmin && (
        <Select value={teams.length && oboTeamId ? oboTeamId : ''} onChange={handleChange} className={classes.select}>
          <MenuItem value={undefined}>-</MenuItem>
          {teams.map(({ id: tid, name }): any => (
            <MenuItem key={tid} value={tid}>
              {name}
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  )
}
