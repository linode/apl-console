import React from 'react'
// import { useApi } from '../hooks/api'
import { makeStyles, MenuList, ListItemText, MenuItem, ListItemIcon, ListSubheader } from '@material-ui/core'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import MainLayout from '../layouts/Main'
import { useSession } from '../session-context'
import { toggleThemeType } from '../theme'

const useStyles = makeStyles(theme => ({
  root: {},
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
}))

export default (): any => {
  const { themeType, setThemeType } = useSession()
  const classes = useStyles()
  const toggleTheme = (): void => {
    setThemeType(toggleThemeType())
  }
  const StyledListSubheader = props => {
    return <ListSubheader className={classes.listSubheader} {...props} />
  }

  return (
    <MainLayout>
      <MenuList className={classes.root}>
        <StyledListSubheader component='div'>
          <ListItemText primary='Interface' />
        </StyledListSubheader>
        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>{themeType === 'dark' ? <Brightness3Icon /> : <BrightnessHighIcon />}</ListItemIcon>
          <ListItemText primary={`${themeType === 'light' ? 'Dark Mode: OFF' : 'Dark Mode: ON'}`} />
        </MenuItem>
        <StyledListSubheader component='div'>
          <ListItemText primary='Software' />
        </StyledListSubheader>
        <MenuItem onClick={toggleTheme}>
          <ListItemText primary='Version: v.1.1.0-beta' />
        </MenuItem>
      </MenuList>
    </MainLayout>
  )
}
