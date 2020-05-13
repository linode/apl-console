import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { ListItem, List, ListItemText, makeStyles, ListItemIcon, MenuItem, MenuList } from '@material-ui/core'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import { find } from 'lodash/collection'
import { useSession } from '../session-context'
import { useSnackbar } from '../utils'
import { useApi } from '../hooks/api'
import { mainStyles } from '../theme'

const useStyles = makeStyles(theme => ({
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

interface Props {
  clusterId?: string
}

export default ({ clusterId }: Props): any => {
  const {
    currentClusterId,
    clusters,
    user: { teamId, isAdmin },
    oboTeamId,
  } = useSession()
  const [cloud, clusterName] = (clusterId || currentClusterId).split('/')
  const cluster = find(clusters, { cloud, cluster: clusterName })
  const { k8sVersion, region } = cluster
  const classes = useStyles()
  const mainClasses = mainStyles()
  const StyledListItem = ({ className, ...props }: any) => {
    return <ListItem className={[clusterId ? classes.listItem : classes.listItemSmall, className]} {...props} />
  }
  const StyledMenuItem = props => {
    return <MenuItem className={mainClasses.selectable} {...props} />
  }
  return (
    <>
      <List dense={!clusterId}>
        <StyledListItem>
          <ListItemText primary={`Name: ${clusterName}`} />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Cloud: ${cloud}`} />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Region: ${region}`} />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`K8S Version: ${k8sVersion}`} />
        </StyledListItem>
        {!clusterId && (
          <StyledMenuItem
            className={mainClasses.selectable}
            component={Link}
            to={`/api/v1/kubecfg/${(isAdmin && oboTeamId) || teamId}`}
          >
            <ListItemIcon>
              <CloudDownloadIcon />
            </ListItemIcon>
            <ListItemText primary='Download KUBECFG' />
          </StyledMenuItem>
        )}
      </List>
    </>
  )
}
