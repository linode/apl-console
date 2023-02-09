import generateDownloadLink from 'generate-download-link'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed'
import AltRoute from '@mui/icons-material/AltRoute'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import AppsIcon from '@mui/icons-material/Apps'
import CloudIcon from '@mui/icons-material/Cloud'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DnsIcon from '@mui/icons-material/Dns'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HistoryIcon from '@mui/icons-material/History'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import HubIcon from '@mui/icons-material/Hub'
import ShortcutIcon from '@mui/icons-material/Link'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import MailIcon from '@mui/icons-material/Mail'
import PeopleIcon from '@mui/icons-material/People'
import PolicyIcon from '@mui/icons-material/Policy'
import SettingsIcon from '@mui/icons-material/Settings'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import HandshakeIcon from '@mui/icons-material/Handshake'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle'
import { Collapse, List, ListItemIcon, ListItemText, ListSubheader, MenuItem, Link as MuiLink } from '@mui/material'
import MenuList from '@mui/material/List'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMainStyles } from 'common/theme'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useDeployQuery, useRestoreQuery, useRevertQuery } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import canDo from 'utils/permission'
import snack from 'utils/snack'
import { SnackbarKey } from 'notistack'
import Versions from './Versions'

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
      backgroundColor: theme.palette.primary.light,
    },
  },
  revert: {
    height: theme.spacing(5),
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
  settingsList: {
    background: 'rgba(0, 0, 0, 0.05)',
  },
  settingsItem: {
    marginLeft: '30px',
  },
}))

function StyledMenuItem(props: any): React.ReactElement {
  const { classes: mainClasses } = useMainStyles()
  const { classes, cx } = useStyles()
  return <MenuItem component={Link} className={cx(mainClasses.selectable, classes.listItem)} {...props} />
}

function StyledListSubheader(props: any): React.ReactElement {
  const { classes } = useStyles()
  return <ListSubheader className={classes.listSubheader} {...props} />
}

interface Props {
  className?: string
  teamId?: any
}

export default function ({ className, teamId }: Props): React.ReactElement {
  const { pathname } = useLocation()
  const {
    ca,
    appsEnabled,
    corrupt,
    editor,
    oboTeamId,
    settings: { cluster, otomi },
    user,
  } = useSession()
  const [collapseSettings, setCollapseSettings] = useLocalStorage('menu-settings-collapse', true)
  const [collapseVersions, setCollapseVersions] = useLocalStorage('menu-cluster-collapse', false)
  const [deploy, setDeploy] = useState(false)
  const [revert, setRevert] = useState(false)
  const [restore, setRestore] = useState(false)
  const {
    isSuccess: okDeploy,
    error: errorDeploy,
    isFetching: isDeploying,
  }: any = useDeployQuery(!deploy ? skipToken : undefined)
  const {
    isSuccess: okRevert,
    error: errorRevert,
    isFetching: isReverting,
  }: any = useRevertQuery(!revert ? skipToken : undefined)
  const {
    isSuccess: okRestore,
    error: errorRestore,
    isFetching: isRestoring,
  }: any = useRestoreQuery(!restore ? skipToken : undefined)
  const { classes, cx } = useStyles()
  const { classes: mainClasses } = useMainStyles()
  const { t } = useTranslation()
  const [keys] = useState<Record<string, SnackbarKey | undefined>>({})
  const closeKey = (key) => {
    if (!keys[key]) return
    snack.close(keys[key])
    delete keys[key]
  }
  const { isAdmin } = user
  useEffect(() => {
    if (deploy) {
      keys.deploy = snack.info(`${t('Scheduling... Hold on!')}`, {
        persist: true,
        key: keys.deploy,
        onClick: () => closeKey('deploy'),
      })
      if (okDeploy || errorDeploy) {
        snack.close(keys.deploy)
        if (errorDeploy) snack.warning(`${t('Deployment failed. Potential conflict with another editor.')}`)
        setDeploy(false)
      }
    }
  }, [deploy, okDeploy, errorDeploy])
  useEffect(() => {
    if (revert) {
      keys.revert = snack.info(`${t('Reverting... Hold on!')}`, {
        persist: true,
        key: keys.revert,
        onClick: () => {
          closeKey('revert')
        },
      })
      if (okRevert || errorRevert) {
        snack.close(keys.revert)
        if (errorRevert) snack.error(`${t('Reverting failed. Please contact support@redkubes.com.')}`)
        setRevert(false)
      }
    }
  }, [revert, okRevert, errorRevert])
  useEffect(() => {
    if (restore) {
      snack.close(keys.revert)
      keys.restore = snack.info(`${t('Restoring... Hold on!')}`, {
        persist: true,
        key: keys.restore,
        onClick: () => {
          closeKey('restore')
        },
      })
      if (okRestore || errorRestore) {
        snack.close(keys.restore)
        if (errorRestore) snack.error(`${t('Restoration of DB failed. Please contact support@redkubes.com.')}`)
        setRestore(false)
      }
    }
  }, [restore, okRestore, errorRestore])
  // END HOOKS

  const handleSettingsCollapse = (): void => {
    setCollapseSettings(!collapseSettings)
  }

  const handleVersionsCollapse = (): void => {
    setCollapseVersions(!collapseVersions)
  }

  const handleDeployClick = (): void => {
    setDeploy(true)
  }

  const handleRevertClick = (): void => {
    setRevert(true)
  }

  const handleRestoreClick = (): void => {
    setRestore(true)
  }

  const settingIds = {
    cluster: [t('Cluster'), <HubIcon />],
    otomi: [t('Otomi'), <DonutLargeIcon />],
    kms: [t('Key Management'), <LockOpenIcon />],
    alerts: [t('Alerts'), <AnnouncementIcon />],
    home: [t('Co-monitoring'), <HandshakeIcon />],
    azure: [t('Azure'), <CloudIcon />],
    dns: [t('DNS'), <DnsIcon />],
    ingress: [t('Ingress'), <AltRoute />],
    oidc: [t('OIDC'), <SettingsEthernetIcon />],
    smtp: [t('SMTP'), <MailIcon />],
    backup: [t('Backup'), <BackupTableIcon />],
  }
  const downloadOpts = {
    data: ca ?? '',
    title: 'Click to download the custom root CA used to generate the browser certs.',
    filename: 'ca.crt',
  }
  const anchor = ca ? generateDownloadLink(downloadOpts) : ''

  return (
    <MenuList className={cx(classes.root, className)} data-cy='menu-list-otomi'>
      <StyledListSubheader component='div' data-cy='list-subheader-actions'>
        <ListItemText primary={t('Actions')} />
      </StyledListSubheader>
      <MenuItem
        className={classes.deploy}
        disabled={!editor || isDeploying || corrupt}
        onClick={handleDeployClick}
        data-cy='menu-item-deploy-changes'
      >
        <ListItemIcon>
          <CloudUploadIcon />
        </ListItemIcon>
        <ListItemText primary={t('Deploy Changes')} />
      </MenuItem>
      <MenuItem
        className={classes.revert}
        disabled={!editor || isDeploying || isReverting || corrupt}
        onClick={handleRevertClick}
        data-cy='menu-item-reset-changes'
      >
        <ListItemIcon>
          <HistoryIcon />
        </ListItemIcon>
        <ListItemText primary={t('Revert Changes')} />
      </MenuItem>
      {isAdmin && !isRestoring && corrupt && (
        <MenuItem className={classes.deploy} onClick={handleRestoreClick} data-cy='menu-item-reset-changes'>
          <ListItemIcon>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary={t('Restore DB')} />
        </MenuItem>
      )}
      {isAdmin && (
        <>
          <StyledListSubheader component='div' data-cy='list-subheader-platform'>
            <ListItemText primary={t('Platform')} />
          </StyledListSubheader>
          <StyledMenuItem to='/' selected={pathname === `/`}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={t('Dashboard')} data-cy='menu-item-dashboard' />
          </StyledMenuItem>

          <StyledMenuItem
            to='/apps/admin'
            selected={pathname.indexOf(`/apps/admin`) === 0}
            data-cy='menu-item-otomiapps'
          >
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText primary={t('Apps')} />
          </StyledMenuItem>

          <StyledMenuItem
            to='/shortcuts/admin'
            selected={pathname === '/shortcuts/admin'}
            data-cy='menu-item-otomishortcuts'
          >
            <ListItemIcon>
              <ShortcutIcon />
            </ListItemIcon>
            <ListItemText primary={t('Shortcuts')} />
          </StyledMenuItem>

          <StyledMenuItem to='/clusters' selected={pathname === '/clusters'} data-cy='menu-item-clusters'>
            <ListItemIcon>
              <CloudIcon />
            </ListItemIcon>
            <ListItemText primary={t('Clusters')} />
          </StyledMenuItem>

          <StyledMenuItem
            to='/policies'
            selected={pathname.indexOf(`/policies`) === 0}
            data-cy='menu-item-policies'
            disabled={!appsEnabled.gatekeeper}
          >
            <ListItemIcon>
              <PolicyIcon />
            </ListItemIcon>
            <ListItemText primary={t('Policies')} />
          </StyledMenuItem>

          <StyledMenuItem
            to='/teams'
            selected={pathname.indexOf('/teams') === 0 && pathname.match(/\//g).length < 3}
            data-cy='menu-item-teams'
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={t('Teams')} />
          </StyledMenuItem>
          <StyledMenuItem to='/services' selected={pathname === '/services'} data-cy='menu-item-services'>
            <ListItemIcon>
              <SwapVerticalCircleIcon />
            </ListItemIcon>
            <ListItemText primary={t('Services')} />
          </StyledMenuItem>
          <StyledMenuItem to='/jobs' selected={pathname === '/jobs'} data-cy='menu-item-jobs'>
            <ListItemIcon>
              <HourglassEmptyIcon />
            </ListItemIcon>
            <ListItemText primary={t('Jobs')} />
          </StyledMenuItem>

          <MenuItem selected={pathname === '/settings'} data-cy='menu-item-settings' onClick={handleSettingsCollapse}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t('Settings')} />
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
                if (id === 'backup' && !appsEnabled.velero) disabled = true
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
          <MenuItem data-cy='menu-item-versions' onClick={handleVersionsCollapse}>
            <ListItemIcon>
              <DynamicFeedIcon />
            </ListItemIcon>
            <ListItemText primary={t('Versions')} />
            {collapseSettings ? <ExpandLess /> : <ExpandMore />}
          </MenuItem>
          <Collapse in={collapseVersions} timeout='auto' unmountOnExit>
            <Versions />
          </Collapse>
        </>
      )}
      {teamId && (
        <>
          <StyledListSubheader component='div'>
            <ListItemText primary={t('TITLE_TEAM', { teamId })} data-cy='list-subheader-team' />
          </StyledListSubheader>
          {oboTeamId !== 'admin' && (
            <StyledMenuItem
              to={`/apps/${teamId}`}
              selected={pathname.indexOf(`/apps/${teamId}`) === 0}
              data-cy='menu-item-team-otomiapps'
            >
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary={t('Apps')} />
            </StyledMenuItem>
          )}
          {oboTeamId !== 'admin' && (
            <StyledMenuItem
              to={`/shortcuts/${teamId}`}
              selected={pathname === `/shortcuts/${teamId}`}
              data-cy='menu-item-otomishortcuts'
            >
              <ListItemIcon>
                <ShortcutIcon />
              </ListItemIcon>
              <ListItemText primary={t('Shortcuts')} />
            </StyledMenuItem>
          )}
          <StyledMenuItem
            to={`/teams/${teamId}/services`}
            selected={pathname.indexOf(`/teams/${teamId}/services`) === 0}
            data-cy='menu-item-team-services'
          >
            <ListItemIcon>
              <SwapVerticalCircleIcon />
            </ListItemIcon>
            <ListItemText primary={t('Services')} />
          </StyledMenuItem>
          <StyledMenuItem
            to={`/teams/${teamId}/jobs`}
            selected={pathname.indexOf(`/teams/${teamId}/jobs`) === 0}
            data-cy='menu-item-team-jobs'
          >
            <ListItemIcon>
              <HourglassEmptyIcon />
            </ListItemIcon>
            <ListItemText primary={t('Jobs')} />
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
            <ListItemText primary={t('Secrets')} />
          </StyledMenuItem>
          {oboTeamId !== 'admin' && (
            <StyledMenuItem
              to={`/teams/${teamId}`}
              selected={pathname === `/teams/${teamId}`}
              data-cy='menu-item-team-settings'
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('Settings')} />
            </StyledMenuItem>
          )}
          <StyledMenuItem
            className={mainClasses.selectable}
            component={MuiLink}
            aria-label={t('Download KUBECFG')}
            href={`/api/v1/kubecfg/${oboTeamId}`}
            disabled={teamId === 'admin' || !canDo(user, oboTeamId, 'downloadKubeConfig')}
          >
            <ListItemIcon>
              <CloudDownloadIcon />
            </ListItemIcon>
            <ListItemText primary={t('Download KUBECFG')} />
          </StyledMenuItem>
          <StyledMenuItem
            className={mainClasses.selectable}
            component={MuiLink}
            aria-label={t('Download DOCKERCFG')}
            href={`/api/v1/dockerconfig/${oboTeamId}`}
            disabled={teamId === 'admin' || !canDo(user, oboTeamId, 'downloadDockerConfig')}
          >
            <ListItemIcon>
              <CloudDownloadIcon />
            </ListItemIcon>
            <ListItemText primary={t('Download DOCKERCFG')} />
          </StyledMenuItem>
          {ca && (
            <StyledMenuItem
              className={mainClasses.selectable}
              component={MuiLink}
              aria-label={t('Download CA')}
              href={anchor}
              download={downloadOpts.filename}
              title={downloadOpts.title}
            >
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText primary={t('Download CA')} />
            </StyledMenuItem>
          )}
        </>
      )}
    </MenuList>
  )
}
