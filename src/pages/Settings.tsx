import React from 'react'
import {
  makeStyles,
  List,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  ListItem,
  ListItemSecondaryAction,
  Switch,
} from '@material-ui/core'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import CheckIcon from '@material-ui/icons/Check'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import { toggleThemeType } from '../theme'
import pkg from '../../package.json'
import ChannelSelector from '../components/ChannelSelector'
import snack from '../utils/snack'

const coreVersion = process.env.CORE_VERSION || 'x.x.x'

const useStyles = makeStyles(theme => ({
  root: {},
  version: {
    fontSize: theme.typography.fontSize,
  },
  listSubheader: {
    backgroundColor: theme.palette.divider,
  },
  listItem: {
    height: theme.spacing(5),
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
      <List className={classes.root}>
        <StyledListSubheader>
          <ListItemText primary='Interface' data-cy='list-item-interface-text' />
        </StyledListSubheader>
        <ListItem className={classes.listItem} button onClick={toggleTheme}>
          <ListItemIcon>{themeType === 'dark' ? <Brightness3Icon /> : <BrightnessHighIcon />}</ListItemIcon>
          <ListItemText primary='Dark Mode' />
          <ListItemSecondaryAction>
            <Switch edge='end' onChange={toggleTheme} checked={themeType === 'dark'} />
          </ListItemSecondaryAction>
        </ListItem>
        <StyledListSubheader>
          <ListItemText primary='Software versions' />
        </StyledListSubheader>
        <ListItem className={classes.listItem}>
          <ListItemIcon title='Up to date!'>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText primary={`console@${pkg.version}`} />
          <ListItemSecondaryAction>
            <ChannelSelector
              channel={pkg.version === 'master' ? 'alpha' : 'stable'}
              setChannel={event => {
                snack.comingSoon()
                event.preventDefault()
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemIcon title='Up to date!'>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText primary={`core@${coreVersion}`} />
          <ListItemSecondaryAction>
            <ChannelSelector
              channel={coreVersion === 'master' ? 'alpha' : 'stable'}
              setChannel={event => {
                snack.comingSoon()
                event.preventDefault()
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>

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
