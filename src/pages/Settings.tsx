import React from 'react'
import { makeStyles, MenuList, ListItemText, MenuItem, ListItemIcon, ListSubheader } from '@material-ui/core'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import { toggleThemeType } from '../theme'

const useStyles = makeStyles(theme => ({
  root: {},
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
}))

export default () => {
  const { themeType, setThemeType } = useSession()
  const classes = useStyles()
  const toggleTheme = (): void => {
    setThemeType(toggleThemeType())
  }
  const StyledListSubheader = props => {
    return <ListSubheader className={classes.listSubheader} {...props} />
  }

  const comp = (
    <>
      <MenuList className={classes.root}>
        <StyledListSubheader>
          <ListItemText primary='Interface' data-cy='list-item-interface-text' />
        </StyledListSubheader>
        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>{themeType === 'dark' ? <Brightness3Icon /> : <BrightnessHighIcon />}</ListItemIcon>
          <ListItemText primary={`${themeType === 'light' ? 'Dark Mode: OFF' : 'Dark Mode: ON'}`} />
        </MenuItem>
        <StyledListSubheader>
          <ListItemText primary='Software' />
        </StyledListSubheader>
        <MenuItem>
          <ListItemText primary='Version: v.1.1.0-beta' />
        </MenuItem>
      </MenuList>

      {/* <Form
        key='settings'
        schema={schema}
        liveValidate={false}
        showErrorList={false}
        ObjectFieldTemplate={ObjectFieldTemplate}
      /> */}
    </>
  )
  return <PaperLayout comp={comp} />
}
