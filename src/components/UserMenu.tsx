import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import PersonIcon from '@material-ui/icons/Person'
import React from 'react'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconButton: {
      position: 'fixed',
      right: 0,
      top: 0,
    },
  }),
)

const UserMenu = (): any => {
  const classes = useStyles({})
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = (): void => {
    setAnchorEl(null)
  }
  const menuId = 'account-menu'
  return (
    <React.Fragment>
      <IconButton
        aria-label='User account'
        aria-controls={menuId}
        aria-haspopup='true'
        onClick={handleProfileMenuOpen}
        className={classes.iconButton}
        color='secondary'
      >
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchorEl} id={menuId} keepMounted open={isMenuOpen} onClose={handleMenuClose}>
        <List component='nav' aria-label='menu'>
          <ListItem button component={Link} to='/'>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary='Dashboard' />
          </ListItem>
          <ListItem button component={Link} to='/account'>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='My account' />
          </ListItem>
        </List>
      </Menu>
    </React.Fragment>
  )
}

export default UserMenu
