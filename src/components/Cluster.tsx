import React from 'react'
import { Link, ListItem, List, ListItemText, makeStyles, ListItemIcon, MenuItem } from '@material-ui/core'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import { get } from 'lodash'
import { User } from '@redkubes/otomi-api-client-axios'
import { useSession } from '../session-context'
import { mainStyles } from '../theme'

const baseUrl = process.env.CONTEXT_PATH || ''

const useStyles = makeStyles((theme) => ({
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
  listItem: {
    height: theme.spacing(5),
  },
  listItemSmall: {
    height: theme.spacing(3),
  },
}))

export function canDownloadKubecfg(user: User, teamId: string | undefined): boolean {
  if (!teamId) return false
  if (user.isAdmin) return true
  const permission = get(user, `authz.${teamId}.deniedAttributes.Team`, [])
  return !permission.includes('downloadKubeConfig')
}

export default (): React.ReactElement => {
  const { cluster, versions, oboTeamId, user } = useSession()
  const classes = useStyles()
  const mainClasses = mainStyles()
  const StyledListItem = ({ className, ...props }: any) => {
    return <ListItem className={`${classes.listItem}, ${className}`} {...props} />
  }
  const StyledMenuItem = (props: any) => {
    return <MenuItem className={mainClasses.selectable} {...props} />
  }

  const teamId = oboTeamId || (user.isAdmin ? 'admin' : undefined)
  const isButtonDisabled = !canDownloadKubecfg(user, teamId)
  return (
    <>
      <List dense>
        <StyledListItem>
          <ListItemText primary={`Name: ${cluster.name}`} data-cy='list-item-text-clustername' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Cloud: ${cluster.provider}`} data-cy='list-item-text-cloud' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Region: ${cluster.region}`} data-cy='list-item-text-region' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`K8S Version: ${cluster.k8sVersion}`} data-cy='list-item-text-k8v' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Otomi Version: ${versions.core}`} data-cy='list-item-text-k8v' />
        </StyledListItem>
        <StyledMenuItem
          className={mainClasses.selectable}
          component={Link}
          aria-label='download'
          href={`${baseUrl}/api/v1/kubecfg/${teamId}`}
          disabled={isButtonDisabled}
        >
          <ListItemIcon>
            <CloudDownloadIcon />
          </ListItemIcon>
          <ListItemText primary='Download KUBECFG' />
        </StyledMenuItem>
      </List>
    </>
  )
}
