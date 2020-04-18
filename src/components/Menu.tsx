import { Button, ListItemText, makeStyles } from '@material-ui/core'
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
import { ListItem, ListSubheader } from './List'

const Deploy = ({ setDirty }): any => {
  const { enqueueSnackbar } = useSnackbar()
  const [result] = useApi('deploy')
  if (result) {
    enqueueSnackbar('Scheduled for deployment')
    setDirty(false)
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

interface Props {
  children?: any
}

export default ({ children = null }: Props): any => {
  const [deploy, setDeploy] = useState(false)
  const [dirty, setDirty] = useState(getDirty())
  const classes = useStyles()
  const handleClick = (): void => {
    setDeploy(true)
  }
  return (
    <List className={classes.root}>
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
      <ListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Enterprise' />
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
      {dirty && (
        <ListItem component='div' onClick={handleClick}>
          <Button startIcon={<CloudUploadIcon />} variant='contained' className={classes.button} color='primary'>
            Deploy changes
          </Button>
        </ListItem>
      )}
      {deploy && <Deploy setDirty={setDirty} />}
    </List>
  )
}
