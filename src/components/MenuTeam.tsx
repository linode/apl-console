import { List, ListItemIcon, ListItemText } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { ListItem, ListSubheader } from './List'
import Menu from './Menu'

interface Props {
  teamId: string
}

export default ({ teamId }: Props): any => {
  return (
    <Menu>
      <List>
        <ListSubheader component='div' id='main-subheader'>
          <ListItemText primary={`Team ${teamId}`} />
        </ListSubheader>
        <ListItem component={Link} to={`/teams/${teamId}`}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary='Overview' />
        </ListItem>
        <ListItem component={Link} to={`/teams/${teamId}/services`}>
          <ListItemIcon>
            <SwapVerticalCircleIcon />
          </ListItemIcon>
          <ListItemText primary='Services' />
        </ListItem>
      </List>
    </Menu>
  )
}
