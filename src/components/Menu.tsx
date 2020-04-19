import { Button, ListItemText, makeStyles } from '@material-ui/core'
import MenuList from '@material-ui/core/List'
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
import { ListItem, MenuItem, ListSubheader } from './List'

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
    <MenuList className={classes.root}>
      {deploy && <Deploy setDirty={setDirty} />}
      <ListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Otomi Stack' />
      </ListSubheader>
      <MenuItem component={Link} to='/'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </MenuItem>
      <MenuItem component={Link} to='/otomi/apps'>
        <ListItemIcon>
          <AppsIcon />
        </ListItemIcon>
        <ListItemText primary='Otomi Apps' />
      </MenuItem>
      <ListSubheader component='div' id='main-subheader'>
        <ListItemText primary='Enterprise' />
      </ListSubheader>
      <MenuItem component={Link} to='/clusters'>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </MenuItem>
      <MenuItem component={Link} to='/teams'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Teams' />
      </MenuItem>
      <MenuItem component={Link} to='/services'>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='Services' />
      </MenuItem>
      {children}
      {dirty && (
        <MenuItem component='div' onClick={handleClick}>
          <Button startIcon={<CloudUploadIcon />} variant='contained' className={classes.button} color='primary'>
            Deploy changes
          </Button>
        </MenuItem>
      )}
    </MenuList>
  )
}
