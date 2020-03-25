import { Button, Divider, ListSubheader, makeStyles } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
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
import { createClasses } from './../theme'

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
    margin: theme.spacing(1),
  },
}))

export default ({ children = null }): any => {
  const [deploy, setDeploy] = useState()
  const classes = createClasses({
    root: {
      textTransform: 'capitalize',
    },
  })

  return (
    <div className={classes.root}>
      <ListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Otomi Stack' />
      </ListSubheader>
      <ListItem component={Link} to='/'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem component={Link} to='/otomi/apps'>
        <ListItemIcon>
          <AppsIcon />
        </ListItemIcon>
        <ListItemText primary='Otomi Apps' />
      </ListItem>
      <Divider />
      <ListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Org Wide' />
      </ListSubheader>
      <ListItem component={Link} to='/clusters'>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </ListItem>
      <ListItem component={Link} to='/teams'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Teams' />
      </ListItem>
      <ListItem component={Link} to='/services'>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='Services' />
      </ListItem>
      {children}
      {getDirty() && (
        <>
          <Divider />
          <ListItem component='div' onClick={setDeploy.bind(this, true)}>
            <Button startIcon={<CloudUploadIcon />} variant='contained' className={classes.button} color='primary'>
              Deploy changes
            </Button>
          </ListItem>
          {deploy && <Deploy />}
        </>
      )}
    </div>
  )
}
