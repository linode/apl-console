import React from 'react'
import { Link, ListItem, List, ListItemText, makeStyles, ListItemIcon, MenuItem } from '@material-ui/core'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import { find } from 'lodash/collection'
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

interface Props {
  clusterId?: string
}

export default ({ clusterId }: Props): React.ReactElement => {
  const {
    mode,
    currentClusterId,
    clusters,
    oboTeamId,
    user: { isAdmin },
  } = useSession()
  const [cloud, name] = (clusterId || currentClusterId).split('/')
  const cluster = find(clusters, { cloud, name })
  const { k8sVersion, otomiVersion, region } = cluster
  const classes = useStyles()
  const mainClasses = mainStyles()
  const StyledListItem = ({ className, ...props }: any) => {
    return <ListItem className={`${clusterId ? classes.listItem : classes.listItemSmall}, ${className}`} {...props} />
  }
  const StyledMenuItem = (props: any) => {
    return <MenuItem className={mainClasses.selectable} {...props} />
  }
  return (
    <>
      <List dense={!clusterId}>
        <StyledListItem>
          <ListItemText primary={`Name: ${name}`} data-cy='list-item-text-clustername' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Cloud: ${cloud}`} data-cy='list-item-text-cloud' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Region: ${region}`} data-cy='list-item-text-region' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`K8S Version: ${k8sVersion}`} data-cy='list-item-text-k8v' />
        </StyledListItem>
        <StyledListItem>
          <ListItemText primary={`Otomi Version: ${otomiVersion}`} data-cy='list-item-text-k8v' />
        </StyledListItem>
        {mode === 'ee' && !clusterId && (
          <StyledMenuItem
            className={mainClasses.selectable}
            component={Link}
            aria-label='download'
            href={`${baseUrl}/api/v1/kubecfg/${oboTeamId || isAdmin ? 'admin' : ''}`}
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
