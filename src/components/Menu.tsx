import AnnouncementIcon from '@mui/icons-material/Announcement'
import AppsIcon from '@mui/icons-material/Apps'
import CloudIcon from '@mui/icons-material/Cloud'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
// import PersonIcon from '@mui/icons-material/Person'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DnsIcon from '@mui/icons-material/Dns'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HomeIcon from '@mui/icons-material/Home'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import ShortcutIcon from '@mui/icons-material/Link'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import MailIcon from '@mui/icons-material/Mail'
import PeopleIcon from '@mui/icons-material/People'
import PolicyIcon from '@mui/icons-material/Policy'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import { Collapse, List, ListItemText, ListSubheader, MenuItem } from '@mui/material'
import MenuList from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMainStyles } from 'common/theme'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useDeployQuery } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import snack from 'utils/snack'
import Cluster from './Cluster'

const useStyles = makeStyles()((theme) => ({
  root: {
    paddingTop: 0,
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
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  settingsList: {
    background: 'rgba(0, 0, 0, 0.05)',
  },
  settingsItem: {
    marginLeft: '30px',
  },
}))

interface Props {
  className?: string
  teamId?: any
}

export default function ({ className, teamId }: Props): React.ReactElement {
  const { pathname } = useLocation()
  const {
    appsEnabled,
    settings: { cluster, otomi },
    user: { isAdmin },
  } = useSession()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  const [collapseSettings, setCollapseSettings] = useLocalStorage('menu-settings-collapse', true)
  const [deploy, setDeploy] = useState(false)
  const { isSuccess: okDeploy, error: errorDeploy }: any = useDeployQuery(!deploy ? skipToken : undefined)
  const { classes, cx } = useStyles()
  const { classes: mainClasses } = useMainStyles()
  const [key, setKey] = useState<any>()
  if (deploy) {
    if (!key) setKey(snack.info('Scheduling... Hold on!', { autoHideDuration: 8000 }))

    if (okDeploy || errorDeploy) {
      snack.close(key)
      if (errorDeploy) setTimeout(() => snack.error('Deployment failed. Please contact support@redkubes.com.'))
      else setTimeout(() => snack.success('Scheduled for deployment'))
      setDeploy(false)
    }
  }

  const StyledMenuItem = React.memo(
    (props: any): React.ReactElement => (
      <MenuItem component={Link} className={cx(mainClasses.selectable, classes.listItem)} {...props} />
    ),
  )
  const StyledListSubheader = React.memo(
    (props: any): React.ReactElement => <ListSubheader className={classes.listSubheader} {...props} />,
  )

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
    <MenuList className={cx(classes.root, className)} data-cy='menu-list-otomi'>
      <StyledListSubheader component='div' data-cy='list-subheader-platform'>
        <ListItemText primary='Platform' />
      </StyledListSubheader>
      <StyledMenuItem to='/' selected={pathname === `/`}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' data-cy='menu-item-dashboard' />
      </StyledMenuItem>
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
          <ListItemText primary='Shortcuts' />
        </StyledMenuItem>
      )}
      <StyledMenuItem to='/clusters' selected={pathname === '/clusters'} data-cy='menu-item-clusters'>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </StyledMenuItem>
      {isAdmin && (
        <StyledMenuItem
          to='/policies'
          selected={pathname.indexOf(`/policies`) === 0}
          data-cy='menu-item-policies'
          disabled={!appsEnabled.gatekeeper}
        >
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
                if (cluster.provider !== 'azure' && id === 'azure') return undefined
                let disabled = false
                if (
                  (['alerts', 'home', 'smtp'].includes(id) && !appsEnabled.alertmanager) ||
                  (['oidc'].includes(id) && !otomi.hasExternalIDP) ||
                  (id === 'dns' && !otomi.hasExternalDNS)
                )
                  disabled = true
                return (
                  <StyledMenuItem
                    key={id}
                    to={`/settings/${id}`}
                    selected={pathname === `/settings/${id}`}
                    data-cy={`menu-item-${id}`}
                    disabled={disabled}
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
      <MenuItem className={classes.deploy} disabled={!isDirty} onClick={handleClick} data-cy='menu-item-deploy-changes'>
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
            <ListItemText primary='Shortcuts' />
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
            disabled={!appsEnabled.vault}
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
