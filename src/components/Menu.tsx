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
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getDirty, client } from '../hooks/api'
import { mainStyles } from '../theme'
import snack from '../utils/snack'
import Cluster from './Cluster'
import { useSession } from '../session-context'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 0,
    textTransform: 'capitalize',
  },
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
  listItem: {
    height: theme.spacing(5),
  },
  deploy: {
    height: theme.spacing(5),
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
}))

interface Props {
  teamId?: any
}

export default ({ teamId }: Props) => {
  const { pathname } = useLocation()
  const {
    mode,
    user: { isAdmin },
  } = useSession()
  const isCE = mode === 'ce'
  const [deploy, setDeploy] = useState(false)
  const [dirty, setDirty] = useState(getDirty())
  useEffect(() => {
    ;(async function checkDeploy() {
      if (deploy) {
        snack.info('Scheduling...', { autoHideDuration: 7000 })
        try {
          await client.deploy()
          snack.success('Scheduled for deployment')
        } catch (e) {
          snack.error('Deployment failed. Please contact support@redkubes.com.')
        }
        setDeploy(false)
        setDirty(false)
      }
    })()
  }, [deploy])

  const classes = useStyles()
  const mainClasses = mainStyles()

  const StyledMenuItem = (props: any) => {
    return <MenuItem component={Link} className={`${mainClasses.selectable} ${classes.listItem}`} {...props} />
  }
  const StyledListSubheader = props => {
    return <ListSubheader className={classes.listSubheader} {...props} />
  }

  const handleClick = (): void => {
    setDeploy(true)
  }
  return (
    <MenuList className={classes.root} data-cy='menu-list-otomi'>
      <StyledListSubheader component='div' data-cy='list-subheader-otomi-stack'>
        <ListItemText primary='Platform' />
      </StyledListSubheader>
      <StyledMenuItem disabled={isCE} to='/' selected={pathname === `/`}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' data-cy='menu-item-dashboard' />
      </StyledMenuItem>
      {isAdmin && (
        <StyledMenuItem to='/apps/admin' selected={pathname === `/apps/admin`} data-cy='menu-item-otomiapps'>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary='Otomi Apps' />
        </StyledMenuItem>
      )}
      <StyledMenuItem to='/settings' selected={pathname === '/settings'} data-cy='menu-item-settings'>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary='Settings' />
      </StyledMenuItem>
      <MenuItem className={classes.deploy} disabled={!dirty} onClick={handleClick} data-cy='menu-item-deploy-changes'>
        <ListItemIcon>
          <CloudUploadIcon />
        </ListItemIcon>
        <ListItemText primary='Deploy Changes' />
      </MenuItem>
      <StyledListSubheader component='div' data-cy='list-subheader-enterprise'>
        <ListItemText primary='Enterprise' />
      </StyledListSubheader>
      <StyledMenuItem to='/clusters' selected={pathname === '/clusters'} data-cy='menu-item-clusters'>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </StyledMenuItem>
      <StyledMenuItem disabled={isCE} to='/teams' selected={pathname === '/teams'} data-cy='menu-item-teams'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Teams' />
      </StyledMenuItem>
      <StyledMenuItem disabled={isCE} to='/services' selected={pathname === '/services'} data-cy='menu-item-services'>
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
          <StyledMenuItem
            disabled={isCE}
            to={`/teams/${teamId}`}
            selected={pathname === `/teams/${teamId}`}
            data-cy='menu-item-team-overview'
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='Overview' />
          </StyledMenuItem>
          <StyledMenuItem
            disabled={isCE}
            to={`/teams/${teamId}/services`}
            selected={pathname === `/teams/${teamId}/services`}
            data-cy='menu-item-team-services'
          >
            <ListItemIcon>
              <SwapVerticalCircleIcon />
            </ListItemIcon>
            <ListItemText primary='Services' />
          </StyledMenuItem>
          <StyledMenuItem
            disabled={isCE}
            to={`/teams/${teamId}/secrets`}
            selected={pathname === `/teams/${teamId}/secrets`}
            data-cy='menu-item-team-secrets'
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary='Secrets' />
          </StyledMenuItem>

          <StyledMenuItem
            to={`/apps/${teamId}`}
            selected={pathname === `/apps/${teamId}`}
            data-cy='menu-item-team-otomiapps'
          >
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary='Otomi Apps' />
          </StyledMenuItem>
        </>
      )}
      <StyledListSubheader component='div' data-cy='list-subheader-current-context'>
        <ListItemText primary='Current Context' />
      </StyledListSubheader>
      <Cluster />
    </MenuList>
  )
}
