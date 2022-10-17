import {
  Brightness3 as Brightness3Icon,
  BrightnessHigh as BrightnessHighIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material'
import { getThemeMode, toggleThemeMode } from 'common/theme'
import { useSession } from 'providers/Session'
import { useTheme } from 'providers/Theme'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { GetTeamsApiResponse, useGetTeamsQuery } from 'redux/otomiApi'
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
  const { classes } = useStyles()
  const { setThemeMode } = useTheme()
  const themeType = getThemeMode()
  const history = useHistory()
  const {
    settings: {
      cluster,
      otomi: { additionalClusters = [] },
    },
    user: { email, teams: userTeams, isAdmin },
    oboTeamId,
    setOboTeamId,
  } = useSession()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { data: allTeams } = useGetTeamsQuery()
  const { t, i18n } = useTranslation()
  // END HOOKs
  const open = Boolean(anchorEl)
  let teams: GetTeamsApiResponse
  const allClusters = [...additionalClusters, cluster]
  if (isAdmin) {
    teams = ((allTeams as any) || []).map(({ id }) => ({
      id,
    }))
  } else {
    teams = (userTeams as any).map((id) => ({
      id,
    }))
  }
  // TODO: get notifications from api and stream updates
  const notifications = [{ type: 'PLATFORM', content: 'Coming soon', status: 'STICKY' }]
  // const unreadNotifications = notifications.filter((n) => n.status === 'UNREAD')
  const unreadNotifications = notifications
  const handleChangeTeam = (event) => {
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
    const { domainSuffix } = additionalClusters.find((c) => c.name === name && c.provider === provider)
    window.location.href = `https://otomi.${domainSuffix}`
  }
  const handleAccountClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleAccountClose = () => {
    setAnchorEl(null)
  }
  const toggleTheme = (): void => {
    setThemeMode(toggleThemeMode())
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
        value={(teams.length && oboTeamId) || ''}
        onChange={handleChangeTeam}
        className={classes.select}
        data-cy='select-oboteam'
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
      >
        {isAdmin && (
          <MenuItem value='admin' data-cy='select-oboteam-admin'>
            {t('admin')}
          </MenuItem>
        )}
        {teams.map(({ id }) => (
          <MenuItem key={id} value={id} data-cy={`select-oboteam-${id}`}>
            {id}
          </MenuItem>
        ))}
      </Select>
      &nbsp;
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title='Account settings'>
          <IconButton
            onClick={handleAccountClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Badge color='secondary' badgeContent={unreadNotifications.length}>
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleAccountClose}
        onClick={handleAccountClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <Badge badgeContent={unreadNotifications.length} color='primary'>
              <NotificationsIcon fontSize='small' />
            </Badge>
          </ListItemIcon>
          Notifications
        </MenuItem>
        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>
            {themeType === 'dark' ? <Brightness3Icon /> : <BrightnessHighIcon fontSize='small' />}
          </ListItemIcon>
          {t('{{themeMode}} mode', { themeMode: themeType === 'light' ? 'Dark' : 'Light' })}
        </MenuItem>
        <MenuItem component={Link} href='/logout-otomi'>
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}
