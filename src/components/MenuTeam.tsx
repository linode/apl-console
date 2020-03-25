import { Divider, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core'
import PeopleIcon from '@material-ui/icons/People'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Menu'

const TeamMenu = ({ teamId }): any => (
  <>
    <Divider />
    <ListSubheader component='div' id='main-subheader'>
      <ListItemText primary={`Team ${teamId}`} />
    </ListSubheader>
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
  </>
)

export default ({ teamId }): any => {
  return (
    <Menu>
      <TeamMenu teamId={teamId} />
    </Menu>
  )
}
