import { Collapse, List, ListItemText, ListSubheader, makeStyles, MenuItem } from '@material-ui/core'
import MenuList from '@material-ui/core/List'
import SettingsIcon from '@material-ui/icons/Settings'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AppsIcon from '@material-ui/icons/Apps'
import CloudIcon from '@material-ui/icons/Cloud'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DashboardIcon from '@material-ui/icons/Dashboard'
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
    mode,
    user: { isAdmin },
  } = useSession()
  const [collapseSettings, setCollapseSettings] = useLocalStorage('menu-settings-collapse', true)
  const isCE = mode === 'ce'
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
    azure: ['Azure', <CloudIcon />],
    customer: ['Customer', <PeopleIcon />],
    dns: ['DNS', <DnsIcon />],
    kms: ['KMS', <LockOpenIcon />],
    home: ['Home', <HomeIcon />],
    oidc: ['OIDC', <SettingsEthernetIcon />],
    otomi: ['Otomi', <DonutLargeIcon />],
    policies: ['Policies', <PolicyIcon />],
    smtp: ['SMTP', <MailIcon />],
  }

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
        <>
          <StyledMenuItem to='/apps/admin' selected={pathname === `/apps/admin`} data-cy='menu-item-otomiapps'>
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary='Otomi Apps' />
          </StyledMenuItem>
          <li>
            <StyledMenuItem
              to={isCE ? undefined : '/settings/otomi'}
              selected={pathname === '/settings'}
              data-cy='menu-item-settings'
              onClick={handleCollapse}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary='Settings' />
              {collapseSettings ? <ExpandLess /> : <ExpandMore />}
            </StyledMenuItem>
          </li>
          <Collapse component='li' in={collapseSettings} timeout='auto' unmountOnExit>
            <List className={classes.settingsList} disablePadding>
              {Object.keys(settingIds).map((id) => {
                // TODO: fix this hack with a generic x-provider approach?
                if (cluster.provider !== Provider.azure && id === 'azure') return undefined
                return (
                  <StyledMenuItem
                    disabled={isCE}
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
      <StyledMenuItem to='/services' selected={pathname === '/services'} data-cy='menu-item-services'>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='Services' />
      </StyledMenuItem>
      <StyledMenuItem disabled={isCE} to='/jobs' selected={pathname === '/jobs'} data-cy='menu-item-jobs'>
        <ListItemIcon>
          <HourglassEmptyIcon />
        </ListItemIcon>
        <ListItemText primary='Jobs' />
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
            to={`/teams/${teamId}/jobs`}
            selected={pathname === `/teams/${teamId}/jobs`}
            data-cy='menu-item-team-jobs'
          >
            <ListItemIcon>
              <HourglassEmptyIcon />
            </ListItemIcon>
            <ListItemText primary='Jobs' />
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
