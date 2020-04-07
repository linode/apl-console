import { Divider, List, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { ListItem } from './List'
import Menu from './Menu'

interface Props {
  teamId: string
}

const TeamMenu = ({ teamId }: Props): any => (
  <List>
    <Divider />
    <ListSubheader component='div' id='main-subheader'>
      <ListItemText primary={`Team ${teamId}`} />
    </ListSubheader>
    <ListItem component={Link} to={`/teams/${teamId}`}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary='Team Details' />
    </ListItem>
    <ListItem component={Link} to={`/teams/${teamId}/services`}>
      <ListItemIcon>
        <SwapVerticalCircleIcon />
      </ListItemIcon>
      <ListItemText primary='Team Services' />
    </ListItem>
  </List>
)

export default ({ teamId }: Props): any => {
  return (
    <Menu>
      <TeamMenu teamId={teamId} />
    </Menu>
  )
}
