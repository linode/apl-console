import { Button, Divider, ListItemText, ListSubheader, makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AppsIcon from '@material-ui/icons/Apps'
import CloudIcon from '@material-ui/icons/Cloud'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getDirty, useApi } from '../hooks/api'
import { useSnackbar } from '../utils'
import { OListItem } from './List'

const Deploy = (): any => {
  const { enqueueSnackbar } = useSnackbar()
  const [result] = useApi('deploy')
  if (result) {
    enqueueSnackbar('Scheduled for deployment')
  }
  return null
}

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
  },
  root: {
    textTransform: 'capitalize',
  },
}))

export default ({ children = null }): any => {
  const [deploy, setDeploy] = useState()
  const classes = useStyles()

  return (
    <List className={classes.root}>
      <ListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Otomi Stack' />
      </ListSubheader>
      <OListItem component={Link} to='/'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </OListItem>
      <OListItem component={Link} to='/otomi/apps'>
        <ListItemIcon>
          <AppsIcon />
        </ListItemIcon>
        <ListItemText primary='Otomi Apps' />
      </OListItem>
      <Divider />
      <ListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Org Wide' />
      </ListSubheader>
      <OListItem component={Link} to='/clusters'>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </OListItem>
      <OListItem component={Link} to='/teams'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Teams' />
      </OListItem>
      <OListItem component={Link} to='/services'>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='Services' />
      </OListItem>
      {children}
      {getDirty() && (
        <>
          <Divider />
          <OListItem component='div' onClick={setDeploy.bind(this, true)}>
            <Button startIcon={<CloudUploadIcon />} variant='contained' className={classes.button} color='primary'>
              Deploy changes
            </Button>
          </OListItem>
          {deploy && <Deploy />}
        </>
      )}
    </List>
  )
}
