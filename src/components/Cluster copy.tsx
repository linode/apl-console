import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core'
import { find } from 'lodash/collection'
import React from 'react'
import { useSession } from '../session-context'

const useStyles = makeStyles(theme => ({
  root: {},
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
  listItem: {
    height: theme.spacing(2),
  },
  listItemTextRight: {
    // flex: '0.4',
    // display: 'flex',
    // justifyContent: 'flex-end',
  },
}))

export default (): any => {
  const { currentClusterId, clusters } = useSession()
  const [cloud, clusterName] = currentClusterId.split('/')
  const cluster = find(clusters, { cloud, cluster: clusterName })
  const { k8sVersion, region } = cluster
  const classes = useStyles()
  const StyledListItem = props => {
    return <ListItem className={classes.listItem} {...props} />
  }

  return (
    <List className={classes.root} dense>
      <StyledListItem>
        <ListItemText className={classes.listItemTextRight} primary='Cluster: ' />
        <ListItemText primary={clusterName} />
      </StyledListItem>
      <StyledListItem>
        <ListItemText className={classes.listItemTextRight} primary='Cloud: ' />
        <ListItemText primary={cloud} />
      </StyledListItem>
      <StyledListItem>
        <ListItemText className={classes.listItemTextRight} primary='Region: ' />
        <ListItemText primary={region} />
      </StyledListItem>
      <StyledListItem>
        <ListItemText className={classes.listItemTextRight} primary='K8S Version: ' />
        <ListItemText primary={k8sVersion} />
      </StyledListItem>
    </List>
  )
}
