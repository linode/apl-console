import { MenuItem, Select, Typography, Hidden, Link, Tooltip, Avatar } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { mainStyles, getThemeType } from '../theme'
import { useSession } from '../session-context'

const useStyles = makeStyles(theme => {
  const isDark = getThemeType() === 'dark'
  const color = isDark ? theme.palette.secondary.contrastText : theme.palette.secondary.main
  const background = isDark ? theme.palette.primary.light : theme.palette.primary.dark
  return {
    avatar: {
      background: theme.palette.common.white,
      color: background,
      marginRight: 10,
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    select: {
      // minWidth: '6rem !important',
      marginRight: '0.5rem',
      paddingLeft: '0.5rem',
      marginLeft: 3,
      background,
      fontSize: '1rem',
      color,
      fontWeight: 'bold',
    },
    icon: {
      fill: color,
    },
  }
})

export default () => {
  const mainClasses = mainStyles()
  const classes = useStyles()
  const history = useHistory()
  const {
    mode,
    user: { email, teams: userTeams, isAdmin },
    teams: allTeams,
    oboTeamId,
    setOboTeamId,
  } = useSession()
  let teams: any[]
  if (isAdmin)
    teams = (allTeams as any).map(({ id }) => ({
      id,
    }))
  else
    teams = (userTeams as any).map(id => ({
      id,
    }))
  const handleChange = event => {
    const teamId = event.target.value
    const path = window.location.pathname
    const teamPart = `/teams/${oboTeamId}`
    const newTeamPart = `/teams/${teamId}`
    const hasTeamId = path.includes(teamId)
    const hasTeamPart = path.includes(teamPart)
    const hasIDvalue = path.split('/').length === 5
    let url
    if (mode === 'ce') {
      url = `/apps/${teamId || `${isAdmin ? 'admin' : ''}`}`
    } else if (teamId) {
      if (hasTeamPart && !hasIDvalue) {
        url = path.replace(teamPart, newTeamPart)
      } else if (hasTeamId && !hasIDvalue) {
        url = path.replace(oboTeamId, teamId)
      } else {
        url = `${newTeamPart}/services`
      }
    } else {
      url = hasTeamPart ? path.replace(teamPart, '') : '/teams'
    }
    setOboTeamId(teamId)
    history.push(url)
    event.preventDefault()
  }
  return (
    <>
      <Typography variant='body1'>team:</Typography>
      <Select
        color='secondary'
        disableUnderline
        value={oboTeamId || ''}
        onChange={handleChange}
        className={classes.select}
        data-cy='select-oboteam'
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
      >
        {isAdmin && (
          <MenuItem value={undefined} data-cy='select-oboteam-undefined'>
            -
          </MenuItem>
        )}
        {teams.map(({ id }) => (
          <MenuItem key={id} value={id} data-cy={`select-oboteam-${id}`}>
            {id}
          </MenuItem>
        ))}
      </Select>
      &nbsp;
      <Avatar className={classes.avatar} />
      <Hidden xsDown>
        <Typography variant='body1' data-cy='text-user-team'>
          <Tooltip title='logout' aria-label='logout'>
            <Link className={mainClasses.headerlink} href='/logout-otomi'>
              {email}
            </Link>
          </Tooltip>{' '}
          <strong>{isAdmin && '(admin)'}</strong>
        </Typography>
      </Hidden>
    </>
  )
}
