import React from 'react'
// import { useApi } from '../hooks/api'
import { makeStyles, MenuList, ListItemText, MenuItem, ListItemIcon, ListSubheader } from '@material-ui/core'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import Form from '@rjsf/material-ui'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import { toggleThemeType } from '../theme'
import { getSettingsSchema } from '../api-spec'
import ObjectFieldTemplate from '../components/rjsf/ObjectFieldTemplate'

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

  // const schema = getSettingsSchema()

  return (
    <PaperLayout>
      <MenuList className={classes.root}>
        <StyledListSubheader>
          <ListItemText primary='Interface' />
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
    </PaperLayout>
  )
}
