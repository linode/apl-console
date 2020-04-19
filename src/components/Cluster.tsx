import React from 'react'
import { ListItem, List, ListItemText, makeStyles } from '@material-ui/core'
import { find } from 'lodash/collection'
import { useSession } from '../session-context'

const useStyles = makeStyles(theme => ({
  root: {},
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
}))

export default (): any => {
  const { currentClusterId, clusters } = useSession()
  const [cloud, clusterName] = currentClusterId.split('/')
  const cluster = find(clusters, { cloud, cluster: clusterName })
  const { k8sVersion, region } = cluster
  const classes = useStyles()

  return (
    <List className={classes.root} dense>
      <ListItem>
        <ListItemText primary={`Name: ${clusterName}`} />
      </ListItem>
      <ListItem>
        <ListItemText primary={`Cloud: ${cloud}`} />
      </ListItem>
      <ListItem>
        <ListItemText primary={`Region: ${region}`} />
      </ListItem>
      <ListItem>
        <ListItemText primary={`K8S Version: ${k8sVersion}`} />
      </ListItem>
    </List>
  )
}
