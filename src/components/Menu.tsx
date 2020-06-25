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
    <MenuList className={classes.root} data-cy='menu-list-otomi'>
      {deploy && <Deploy setDirty={setDirty} />}
      <StyledListSubheader component='div' id='main-subheader' data-cy='list-subheader-otomi-stack'>
        <ListItemText primary='Otomi Stack' />
      </StyledListSubheader>
      <StyledMenuItem component={Link} to='/'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' data-cy='menu-item-dashboard'/>
      </StyledMenuItem>
      {isAdmin && (
        <StyledMenuItem component={Link} to='/apps/admin' selected={pathname === '/apps/admin'}>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary='Otomi Apps' data-cy='menu-item-apps'/>
        </StyledMenuItem>
      )}
      <StyledMenuItem component={Link} to='/settings' selected={pathname === '/settings'} data-cy='menu-item-settings'>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary='Settings' />
      </StyledMenuItem>
      <StyledMenuItem className={classes.deploy} disabled={!dirty} onClick={handleClick} data-cy='menu-item-deploy-changes'>
        <ListItemIcon>
          <CloudUploadIcon />
        </ListItemIcon>
        <ListItemText primary='Deploy Changes' />
      </StyledMenuItem>
      <StyledListSubheader component='div' id='main-subheader' data-cy='list-subheader-enterprise'>
        <ListItemText primary='Enterprise' />
      </StyledListSubheader>
      <StyledMenuItem component={Link} to='/clusters' selected={pathname === '/clusters'} data-cy='menu-item-clusters'>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </StyledMenuItem>
      <StyledMenuItem component={Link} to='/teams' selected={pathname === '/teams'} data-cy='menu-item-teams'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Teams' />
      </StyledMenuItem>
      <StyledMenuItem component={Link} to='/services' selected={pathname === '/services'} data-cy='menu-item-services'>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='Services' />
      </StyledMenuItem>
      {teamId && (
        <>
          <StyledListSubheader component='div'>
            <ListItemText primary={`Team ${teamId}`} data-cy='list-subheader-team' />
          </StyledListSubheader>
          <StyledMenuItem component={Link} to={`/teams/${teamId}`} selected={pathname === `/teams/${teamId}`}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='Overview' data-cy='menu-item-team-overview' />
          </StyledMenuItem>
          <StyledMenuItem
            component={Link}
            to={`/teams/${teamId}/secrets`}
            selected={pathname === `/teams/${teamId}/secrets`}            
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary='Secrets' data-cy='menu-item-team-secrets'/>
          </StyledMenuItem>
          <StyledMenuItem
            component={Link}
            to={`/teams/${teamId}/services`}
            selected={pathname === `/teams/${teamId}/services`}
          >
            <ListItemIcon>
              <SwapVerticalCircleIcon />
            </ListItemIcon>
            <ListItemText primary='Services' data-cy='menu-item-team-services'/>
          </StyledMenuItem>
          <StyledMenuItem component={Link} to={`/apps/${teamId}`} selected={pathname === `/apps/${teamId}`} 
            data-cy='menu-item-team-apps'>
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary='Otomi Apps' />
          </StyledMenuItem>
        </>
      )}
      <StyledListSubheader component='div' id='action-subheader' data-cy='list-subheader-current-context'>
        <ListItemText primary='Current Context' />
      </StyledListSubheader>
      <Cluster />
    </MenuList>
  )
}
