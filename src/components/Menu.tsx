import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
  MenuItem,
  Typography,
} from '@material-ui/core'
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
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { getDirty, useApi } from '../hooks/api'
import { mainStyles } from '../theme'
import snack from '../utils/snack'
import Cluster from './Cluster'
import { useSession } from '../session-context'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    // textTransform: 'capitalize',
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
  settingItem: {
    backgroundColor: theme.palette.divider,
    marginLeft: 55,
  },
}))

interface Props {
  teamId?: any
}

export default ({ teamId }: Props): React.ReactElement => {
  const { pathname } = useLocation()
  const {
    mode,
    user: { isAdmin },
  } = useSession()
  const { collapseSettings, setCollapseSettings } = useSession()
  const isCE = mode === 'ce'
  const [deploy, setDeploy] = useState(false)
  const [dirty, setDirty] = useState(getDirty())
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deployRes, deploying, deployError]: any = useApi('deploy', !!deploy)
  let key
  if (deploy) {
    if (!deploying) {
      if (!key) {
        setTimeout(() => {
          key = snack.info('Scheduling...hold on', { autoHideDuration: 20000 })
        })
      }
    }
    if (deployRes || deployError) {
      setTimeout(() => {
        snack.close(key)
      })
      if (deployError) setTimeout(() => snack.error('Deployment failed. Please contact support@redkubes.com.'))
      else setTimeout(() => snack.success('Scheduled for deployment'))
      setDeploy(false)
      setDirty(false)
    }
  }

  const classes = useStyles()
  const mainClasses = mainStyles()

  const StyledMenuItem = (props: any) => {
    return <MenuItem component={Link} className={`${mainClasses.selectable} ${classes.listItem}`} {...props} />
  }
  const StyledListSubheader = (props) => {
    return <ListSubheader className={classes.listSubheader} {...props} />
  }

  const handleCollapse = (): void => {
    setCollapseSettings((prevCollapse) => !prevCollapse)
  }

  const settingIds = ['alerts', 'azure', 'customer', 'dns', 'kms', 'home', 'oidc', 'otomi', 'smtp']

  return (
    <MenuList className={classes.root} data-cy='menu-list-otomi'>
      <StyledListSubheader component='div' data-cy='list-subheader-platform'>
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
      <li>
        <StyledMenuItem
          to='/settings'
          selected={pathname === '/settings'}
          data-cy='menu-item-settings'
          onClick={handleCollapse}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary='Settings' />
          {
            // eslint-disable-next-line no-nested-ternary
            collapseSettings != null ? collapseSettings ? <ExpandLess /> : <ExpandMore /> : null
          }
        </StyledMenuItem>
      </li>
      <Collapse component='li' in={collapseSettings} timeout='auto' unmountOnExit>
        <List disablePadding>
          {settingIds.map((id) => {
            return (
              <StyledMenuItem
                key={id}
                className={classes.settingItem}
                to={`/settings/${id}`}
                selected={pathname === `/settings/${id}`}
                data-cy={`menu-item-${id}`}
              >
                <ListItemText primary={id} />
              </StyledMenuItem>
            )
          })}
        </List>
      </Collapse>
      <MenuItem
        className={classes.deploy}
        disabled={!dirty}
        onClick={handleCollapse}
        data-cy='menu-item-deploy-changes'
      >
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
        <ListItemText primary='Cluster' />
      </StyledListSubheader>
      <Cluster />
    </MenuList>
  )
}
