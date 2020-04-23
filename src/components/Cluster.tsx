import React from 'react'
import { ListItem, List, ListItemText, makeStyles } from '@material-ui/core'
import { find } from 'lodash/collection'
import { useSession } from '../session-context'

const useStyles = makeStyles(theme => ({
  root: {},
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
  const { currentClusterId, clusters } = useSession()
  const [cloud, clusterName] = (clusterId || currentClusterId).split('/')
  const cluster = find(clusters, { cloud, cluster: clusterName })
  const { k8sVersion, region } = cluster
  const classes = useStyles()
  const StyledListItem = props => {
    return <ListItem className={clusterId ? classes.listItem : classes.listItemSmall} {...props} />
  }
  return (
    <List className={classes.root} dense={!clusterId}>
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
    </List>
  )
}
