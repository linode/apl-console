import { Divider, List, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { OListItem } from './List'
import Menu from './Menu'

const TeamMenu = ({ teamId }): any => (
  <List>
    <Divider />
    <ListSubheader component='div' id='main-subheader'>
      <ListItemText primary={`Team ${teamId}`} />
    </ListSubheader>
    <OListItem component={Link} to={`/teams/${teamId}`}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary='Team Details' />
    </OListItem>
    <OListItem component={Link} to={`/teams/${teamId}/services`}>
      <ListItemIcon>
        <SwapVerticalCircleIcon />
      </ListItemIcon>
      <ListItemText primary='Team Services' />
    </OListItem>
  </List>
)

export default ({ teamId }): any => {
  return (
    <Menu>
      <TeamMenu teamId={teamId} />
    </Menu>
  )
}
