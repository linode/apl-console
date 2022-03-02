import { Avatar, Box, Link, MenuItem, Select, Tooltip, Typography } from '@mui/material'
import { useSession } from 'common/session-context'
import { getThemeMode, useMainStyles } from 'common/theme'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => {
  const isDark = getThemeMode() === 'dark'
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
      height: 36,
      borderRadius: 18,
      borderWidth: 0,
    },
    switchLabel: {
      // minWidth: '6rem !important',
      marginRight: '0.5rem',
      paddingLeft: '0.5rem',
      marginLeft: 3,
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    switch: {},
    icon: {
      fill: color,
    },
  }
})

export default function (): React.ReactElement {
  const { classes: mainClasses } = useMainStyles()
  const { classes } = useStyles()
  const history = useHistory()
  const {
    cluster,
    clusters,
    user: { email, teams: userTeams, isAdmin },
    teams: allTeams,
    oboTeamId,
    setOboTeamId,
  } = useSession()
  let teams: any[]
  const allClusters = [...clusters, cluster]
  if (isAdmin) {
    teams = (allTeams as any).map(({ id }) => ({
      id,
    }))
  } else {
    teams = userTeams.map((id) => ({
      id,
    }))
  }
  const handleChange = (event) => {
    const teamId = event.target.value
    const path = window.location.pathname
    const teamPart = `/teams/${oboTeamId}`
    const newTeamPart = `/teams/${teamId}`
    const hasTeamId = path.includes(teamId)
    const hasTeamPart = path.includes(teamPart)
    const hasIDvalue = path.split('/').length === 5
    let url
    if (teamId) {
      if (hasTeamPart && !hasIDvalue) url = path.replace(teamPart, newTeamPart)
      else if (hasTeamId && !hasIDvalue) url = path.replace(oboTeamId, teamId)
      else url = `${newTeamPart}/services`
    } else url = hasTeamPart ? path.replace(teamPart, '') : '/teams'

    setOboTeamId(teamId)
    history.push(url)
    event.preventDefault()
  }
  const handleChangeCluster = (event) => {
    const id = event.target.value
    const [provider, name] = id.split('-')
    const { domainSuffix } = clusters.find((c) => c.name === name && c.provider === provider)
    window.location.href = `https://otomi.${domainSuffix}`
  }
  return (
    <>
      <Typography variant='body1'>cluster:</Typography>
      <Select
        color='secondary'
        value={`${cluster.provider}-${cluster.name}`}
        onChange={handleChangeCluster}
        className={classes.select}
        data-cy='select-cluster'
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
      >
        {allClusters.map(({ name, provider }) => {
          const id = `${provider}-${name}`
          return (
            <MenuItem key={id} value={id} data-cy={`select-cluster-${id}`}>
              {id}
            </MenuItem>
          )
        })}
      </Select>
      &nbsp;
      <Typography variant='body1'>team:</Typography>
      <Select
        color='secondary'
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
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography variant='body1' data-cy='text-user-team'>
          <Tooltip title='logout' aria-label='logout'>
            <Link className={mainClasses.headerlink} href='/logout-otomi'>
              {email}
            </Link>
          </Tooltip>{' '}
          <strong>{isAdmin && '(admin)'}</strong>
        </Typography>
      </Box>
    </>
  )
}
