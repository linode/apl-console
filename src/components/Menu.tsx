import { ListItemText, ListSubheader, makeStyles, MenuItem } from '@material-ui/core'
import MenuList from '@material-ui/core/List'
import SettingsIcon from '@material-ui/icons/Settings'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AppsIcon from '@material-ui/icons/Apps'
import CloudIcon from '@material-ui/icons/Cloud'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DashboardIcon from '@material-ui/icons/Dashboard'
import LockIcon from '@material-ui/icons/Lock'
import PeopleIcon from '@material-ui/icons/People'
import PersonIcon from '@material-ui/icons/Person'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getDirty, useApi } from '../hooks/api'
import { mainStyles } from '../theme'
import { useSnackbar } from '../utils'
import Cluster from './Cluster'
import { useSession } from '../session-context'

const Deploy = ({ setDirty }): any => {
  const { enqueueSnackbar } = useSnackbar()
  const [result] = useApi('deploy')
  if (result) {
    enqueueSnackbar('Scheduled for deployment')
    setDirty(false)
  }
  return null
}

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 0,
    textTransform: 'capitalize',
  },
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
  deploy: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
}))

interface Props {
  teamId?: any
}

export default ({ teamId }: Props): any => {
  const { pathname } = useLocation()
  const {
    user: { isAdmin },
  } = useSession()
  const [deploy, setDeploy] = useState(false)
  const [dirty, setDirty] = useState(getDirty())
  const classes = useStyles()
  const mainClasses = mainStyles()
  const StyledMenuItem = props => {
    return <MenuItem className={mainClasses.selectable} {...props} />
  }
  const StyledListSubheader = props => {
    return <ListSubheader className={classes.listSubheader} {...props} />
  }

  const handleClick = (): void => {
    setDeploy(true)
  }
  return (
    <MenuList className={classes.root}>
      {deploy && <Deploy setDirty={setDirty} />}
      <StyledListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Otomi Stack' />
      </StyledListSubheader>
      <StyledMenuItem component={Link} to='/'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </StyledMenuItem>
      {isAdmin && (
        <StyledMenuItem component={Link} to='/apps/admin' selected={pathname === '/apps/admin'}>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary='Otomi Apps' />
        </StyledMenuItem>
      )}
      <StyledMenuItem component={Link} to='/settings' selected={pathname === '/settings'}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary='Settings' />
      </StyledMenuItem>
      <StyledMenuItem className={classes.deploy} disabled={!dirty} onClick={handleClick}>
        <ListItemIcon>
          <CloudUploadIcon />
        </ListItemIcon>
        <ListItemText primary='Deploy Changes' />
      </StyledMenuItem>
      <StyledListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Enterprise' />
      </StyledListSubheader>
      <StyledMenuItem component={Link} to='/clusters' selected={pathname === '/clusters'}>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </StyledMenuItem>
      <StyledMenuItem component={Link} to='/teams' selected={pathname === '/teams'}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Teams' />
      </StyledMenuItem>
      <StyledMenuItem component={Link} to='/services' selected={pathname === '/services'}>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='Services' />
      </StyledMenuItem>
      {teamId && (
        <>
          <StyledListSubheader component='div' id='team-subheader'>
            <ListItemText primary={`Team ${teamId}`} />
          </StyledListSubheader>
          <StyledMenuItem component={Link} to={`/teams/${teamId}`} selected={pathname === `/teams/${teamId}`}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='Overview' />
          </StyledMenuItem>
          <StyledMenuItem
            component={Link}
            to={`/teams/${teamId}/secrets`}
            selected={pathname === `/teams/${teamId}/secrets`}
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary='Secrets' />
          </StyledMenuItem>
          <StyledMenuItem
            component={Link}
            to={`/teams/${teamId}/services`}
            selected={pathname === `/teams/${teamId}/services`}
          >
            <ListItemIcon>
              <SwapVerticalCircleIcon />
            </ListItemIcon>
            <ListItemText primary='Services' />
          </StyledMenuItem>
          <StyledMenuItem component={Link} to={`/apps/${teamId}`} selected={pathname === `/apps/${teamId}`}>
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary='Otomi Apps' />
          </StyledMenuItem>
        </>
      )}
      <StyledListSubheader component='div' id='action-subheader'>
        <ListItemText primary='Current Context' />
      </StyledListSubheader>
      <Cluster />
    </MenuList>
  )
}
