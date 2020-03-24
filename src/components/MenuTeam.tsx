import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import CloudIcon from '@material-ui/icons/Cloud'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import React from 'react'
import { Link } from 'react-router-dom'

export default ({ teamId }): any => {
  return (
    <div>
      <ListItem component={Link} to='/'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
      <ListItem component={Link} to='/otomi/apps'>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary='Otomi Apps' />
      </ListItem>
      <ListItem component={Link} to={`/teams/${teamId}`}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Team Details' />
      </ListItem>
      <ListItem component={Link} to={`/teams/${teamId}/services`}>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='Team Services' />
      </ListItem>
      <ListItem component={Link} to={`/services`}>
        <ListItemIcon>
          <SwapVerticalCircleIcon />
        </ListItemIcon>
        <ListItemText primary='All Services' />
      </ListItem>
      <ListItem component={Link} to='/teams'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='All Teams' />
      </ListItem>
      <ListItem component={Link} to={`/clusters`}>
        <ListItemIcon>
          <CloudIcon />
        </ListItemIcon>
        <ListItemText primary='Clusters' />
      </ListItem>
    </div>
  )
}
