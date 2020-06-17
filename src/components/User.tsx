import { MenuItem, Select, Typography } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
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
  const history = useHistory()
  const {
    user: { email, teamId, isAdmin },
    oboTeamId,
    setOboTeamId,
  } = useSession()

  const handleChange = (event): any => {
    const val = event.target.value
    const url = val ? `/teams/${val}/services` : '/teams'
    setOboTeamId(event.target.value)
    history.push(url)
    event.preventDefault()
  }
  return (
    <>
      {isAdmin && (
        <>
          <Typography variant='body1'>Admin acting for:</Typography>
          <Select value={teams.length && oboTeamId ? oboTeamId : ''} onChange={handleChange} className={classes.select}>
            <MenuItem value={undefined}>-</MenuItem>
            {teams.map(({ id }): any => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
          &nbsp;
        </>
      )}
    </>
  )
}
