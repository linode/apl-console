import { Collapse, List, ListItemText, ListSubheader, makeStyles, MenuItem } from '@material-ui/core'
import MenuList from '@material-ui/core/List'
import SettingsIcon from '@material-ui/icons/Settings'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AppsIcon from '@material-ui/icons/Apps'
import ShortcutIcon from '@material-ui/icons/Link'
import CloudIcon from '@material-ui/icons/Cloud'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import LockIcon from '@material-ui/icons/Lock'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import PeopleIcon from '@material-ui/icons/People'
import PersonIcon from '@material-ui/icons/Person'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet'
import DnsIcon from '@material-ui/icons/Dns'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import HomeIcon from '@material-ui/icons/Home'
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import MailIcon from '@material-ui/icons/Mail'
import { Provider } from '@redkubes/otomi-api-client-axios'
import PolicyIcon from '@material-ui/icons/Policy'
import { useApi } from '../hooks/api'
import { mainStyles } from '../theme'
import snack from '../utils/snack'
import Cluster from './Cluster'
import { useSession } from '../session-context'
import { useLocalStorage } from '../hooks/useLocalStorage'

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
  settingsList: {
    background: 'rgba(0, 0, 0, 0.05)',
  },
  settingsItem: {
    marginLeft: '30px',
  },
}))

interface Props {
  teamId?: any
}

export default ({ teamId }: Props): React.ReactElement => {
  const { pathname } = useLocation()
  const {
    cluster,
    dirty,
    user: { isAdmin },
  } = useSession()
  const [collapseSettings, setCollapseSettings] = useLocalStorage('menu-settings-collapse', true)
  const [deploy, setDeploy] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deployRes, deploying, deployError]: any = useApi('deploy', !!deploy)
  let key
  if (deploy) {
    if (!deploying) {
      if (!key) {
        setTimeout(() => {
          key = snack.info('Scheduling... Hold on!', { autoHideDuration: 8000 })
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

  const handleClick = (): void => {
    setDeploy(true)
  }

  const settingIds = {
    alerts: ['Alerts', <AnnouncementIcon />],
    home: ['Home alerts', <HomeIcon />],
    azure: ['Azure', <CloudIcon />],
    dns: ['DNS', <DnsIcon />],
    kms: ['KMS', <LockOpenIcon />],
    oidc: ['OIDC', <SettingsEthernetIcon />],
    otomi: ['Otomi', <DonutLargeIcon />],
    smtp: ['SMTP', <MailIcon />],
  }

  return (
    <MenuList className={classes.root} data-cy='menu-list-otomi'>
      <StyledListSubheader component='div' data-cy='list-subheader-platform'>
        <ListItemText primary='Enterprise' />
      </StyledListSubheader>
      {/* <StyledMenuItem to='/' selected={pathname === `/`}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' data-cy='menu-item-dashboard' />
      </StyledMenuItem> */}
      {isAdmin && (
        <StyledMenuItem to='/apps/admin' selected={pathname.indexOf(`/apps/admin`) === 0} data-cy='menu-item-otomiapps'>
          <ListItemIcon>
            <AppsIcon />
          </ListItemIcon>
          <ListItemText primary='Apps' />
        </StyledMenuItem>
      )}
      {isAdmin && (
        <StyledMenuItem
          to='/shortcuts/admin'
          selected={pathname === '/shortcuts/admin'}
          data-cy='menu-item-otomishortcuts'
        >
          <ListItemIcon>
            <ShortcutIcon />
          </ListItemIcon>
          <ListItemText primary='App shortcuts' />
        </StyledMenuItem>
      )}
      <StyledMenuItem to='/clusters' selected={pathname === '/clusters'} data-cy='menu-item-clusters'>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </StyledMenuItem>
      {isAdmin && (
        <StyledMenuItem to='/policies' selected={pathname.indexOf(`/policies`) === 0} data-cy='menu-item-policies'>
          <ListItemIcon>
            <PolicyIcon />
          </ListItemIcon>
          <ListItemText primary='Policies' />
        </StyledMenuItem>
      )}
      <StyledMenuItem
        to='/teams'
        selected={pathname.indexOf('/teams') === 0 && pathname.match(/\//g).length < 3}
        data-cy='menu-item-teams'
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Teams' />
      </StyledMenuItem>
      <StyledMenuItem to='/services' selected={pathname === '/services'} data-cy='menu-item-services'>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='Services' />
      </StyledMenuItem>
      <StyledMenuItem to='/jobs' selected={pathname === '/jobs'} data-cy='menu-item-jobs'>
        <ListItemIcon>
          <HourglassEmptyIcon />
        </ListItemIcon>
        <ListItemText primary='Jobs' />
      </StyledMenuItem>
      {isAdmin && (
        <>
          <MenuItem selected={pathname === '/settings'} data-cy='menu-item-settings' onClick={handleCollapse}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Settings' />
            {collapseSettings ? <ExpandLess /> : <ExpandMore />}
          </MenuItem>
          <Collapse component='li' in={collapseSettings} timeout='auto' unmountOnExit>
            <List className={classes.settingsList} disablePadding>
              {Object.keys(settingIds).map((id) => {
                // TODO: fix this hack with a generic x-provider approach?
                if (cluster.provider !== Provider.azure && id === 'azure') return undefined
                return (
                  <StyledMenuItem
                    key={id}
                    to={`/settings/${id}`}
                    selected={pathname === `/settings/${id}`}
                    data-cy={`menu-item-${id}`}
                  >
                    <ListItemIcon className={classes.settingsItem}>{settingIds[id][1]}</ListItemIcon>
                    <ListItemText primary={settingIds[id][0]} />
                  </StyledMenuItem>
                )
              })}
            </List>
          </Collapse>
        </>
      )}
      <MenuItem className={classes.deploy} disabled={!dirty} onClick={handleClick} data-cy='menu-item-deploy-changes'>
        <ListItemIcon>
          <CloudUploadIcon />
        </ListItemIcon>
        <ListItemText primary='Deploy Changes' />
      </MenuItem>
      {teamId && (
        <>
          <StyledListSubheader component='div'>
            <ListItemText primary={`Team ${teamId}`} data-cy='list-subheader-team' />
          </StyledListSubheader>
          <StyledMenuItem
            to={`/apps/${teamId}`}
            selected={pathname.indexOf(`/apps/${teamId}`) === 0}
            data-cy='menu-item-team-otomiapps'
          >
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary='Apps' />
          </StyledMenuItem>
          <StyledMenuItem
            to={`/shortcuts/${teamId}`}
            selected={pathname === `/shortcuts/${teamId}`}
            data-cy='menu-item-otomishortcuts'
          >
            <ListItemIcon>
              <ShortcutIcon />
            </ListItemIcon>
            <ListItemText primary='App shortcuts' />
          </StyledMenuItem>
          <StyledMenuItem
            to={`/teams/${teamId}/services`}
            selected={pathname.indexOf(`/teams/${teamId}/services`) === 0}
            data-cy='menu-item-team-services'
          >
            <ListItemIcon>
              <SwapVerticalCircleIcon />
            </ListItemIcon>
            <ListItemText primary='Services' />
          </StyledMenuItem>
          <StyledMenuItem
            to={`/teams/${teamId}/jobs`}
            selected={pathname.indexOf(`/teams/${teamId}/jobs`) === 0}
            data-cy='menu-item-team-jobs'
          >
            <ListItemIcon>
              <HourglassEmptyIcon />
            </ListItemIcon>
            <ListItemText primary='Jobs' />
          </StyledMenuItem>
          <StyledMenuItem
            to={`/teams/${teamId}/secrets`}
            selected={pathname.indexOf(`/teams/${teamId}/secrets`) === 0}
            data-cy='menu-item-team-secrets'
          >
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary='Secrets' />
          </StyledMenuItem>
          <StyledMenuItem
            to={`/teams/${teamId}`}
            selected={pathname === `/teams/${teamId}`}
            data-cy='menu-item-team-settings'
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary='Settings' />
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
