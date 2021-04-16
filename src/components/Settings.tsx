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
import React from 'react'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import CheckIcon from '@material-ui/icons/Check'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: has no exported member 'Settings'
import { Settings } from '@redkubes/otomi-api-client-axios'
import { useSession } from '../session-context'

import { toggleThemeType } from '../theme'
import pkg from '../../package.json'
import ChannelSelector from './ChannelSelector'
import snack from '../utils/snack'

interface Props {
  onSubmit: CallableFunction
  settings: Settings
}

const useStyles = makeStyles((theme) => ({
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

export default ({ onSubmit, settings }: Props): React.ReactElement => {
  const { mode, themeType, setThemeType, versions } = useSession()
  const isCE = mode === 'ce'
  const classes = useStyles()
  const toggleTheme = (): void => {
    setThemeType(toggleThemeType())
  }
  const StyledListSubheader = (props) => {
    return <ListSubheader className={classes.listSubheader} {...props} />
  }

  return (
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
              disabled={isCE}
              channel={pkg.version === 'master' ? 'alpha' : 'stable'}
              setChannel={(event) => {
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
          <ListItemText primary={`core@${versions.core}`} />
          <ListItemSecondaryAction>
            <ChannelSelector
              disabled={isCE}
              channel={versions.core === 'master' ? 'alpha' : 'stable'}
              setChannel={(event) => {
                snack.comingSoon()
                event.preventDefault()
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        {!isCE && (
          <ListItem className={classes.listItem}>
            <ListItemIcon title='Up to date!'>
              <CheckIcon />
            </ListItemIcon>
            <ListItemText primary={`api@${versions.api}`} />
            <ListItemSecondaryAction>
              <ChannelSelector
                disabled={isCE}
                channel={versions.api === 'master' ? 'alpha' : 'stable'}
                setChannel={(event) => {
                  snack.comingSoon()
                  event.preventDefault()
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )}
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
}
