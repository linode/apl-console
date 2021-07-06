import { Hidden, makeStyles, Tooltip, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Badge from '@material-ui/core/Badge'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import clsx from 'clsx'
import React, { useState } from 'react'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import Menu from '../components/Menu'
import User from '../components/User'
import { useSession } from '../session-context'
import { mainStyles, toggleThemeType } from '../theme'

const drawerWidth = '240px'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    // a: theme.palette.primary.dark,
  },
  title: {
    fontFamily: '"Comfortaa", "Roboto", "Helvetica", "Arial", sans-serif;',
  },
  subTitle: {
    fontFamily: '"Comfortaa", "Roboto", "Helvetica", "Arial", sans-serif;',
    fontSize: '14px',
    marginTop: '3px',
    marginLeft: '6px',
    fontStyle: 'italic',
    fontWeight: 'bolder',
  },
  logo: {
    flexGrow: 1,
    marginRight: '1vw',
    justifyContent: 'left',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    ...theme.mixins.toolbar,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  menuButtonHidden: {
    display: 'none',
  },
  drawer: {
    // backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerContainer: {
    // overflow: 'auto',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    height: '100vh',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}))

interface Props {
  children?: any
}

export default (props: Props): React.ReactElement => {
  const { children } = props
  const { mode, oboTeamId, themeType, setThemeType } = useSession()

  const classes = useStyles(props)
  const mainClasses = mainStyles()
  const [open, setOpen] = useState(false)
  const handleDrawerOpen = (e) => {
    e.preventDefault()
    if (!open) setOpen(true)
  }
  const handleDrawerClose = (e) => {
    e.preventDefault()
    setOpen(false)
  }
  const toggleTheme = (): void => {
    setThemeType(toggleThemeType())
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const img = (
    <img
      style={{ marginRight: '1vw' }}
      // eslint-disable-next-line global-require
      src={`${process.env.CONTEXT_PATH || ''}/logos/otomi_logo.svg`}
      width='40'
      height='40'
      alt='otomi logo'
    />
  )

  const drawer = (
    <div className={classes.drawerContainer}>
      <Menu teamId={oboTeamId} />
    </div>
  )
  const toolbar = (
    <Toolbar className={classes.toolbar}>
      <div className={classes.logo}>
        <Hidden smDown implementation='css'>
          <IconButton color='inherit'>
            {img}
            <Typography className={classes.title} variant='h6'>
              otomi console
            </Typography>
            <Typography className={classes.subTitle} variant='h6'>
              {mode.toUpperCase()}
            </Typography>
          </IconButton>
        </Hidden>
        <Hidden mdUp implementation='css'>
          <IconButton onClick={handleDrawerOpen}>{img}</IconButton>
        </Hidden>
      </div>
      <User />
      <Tooltip title='Coming soon: notifications' aria-label='notifications'>
        <IconButton color='inherit'>
          <Badge badgeContent={1} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <IconButton color='inherit' title={`Toggle theme: ${themeType}`} onClick={toggleTheme}>
        {themeType === 'dark' ? <Brightness3Icon /> : <BrightnessHighIcon />}
      </IconButton>
    </Toolbar>
  )

  return (
    <div className={`${classes.root} ${mainClasses.forms}`}>
      <CssBaseline />
      <AppBar position='fixed' className={clsx(classes.appBar, open && classes.appBarShift)}>
        {toolbar}
      </AppBar>
      <Hidden mdUp implementation='css'>
        <Drawer
          variant='temporary'
          className={classes.drawer}
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          open={open}
          onClick={handleDrawerOpen}
          data-cy='drawer-small-screen'
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          {/* <Divider /> */}
          {drawer}
          <Divider />
          {/* <List>{secondaryListItems}</List> */}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation='css'>
        <Drawer
          className={classes.drawer}
          variant='permanent'
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          data-cy='drawer-big-screen'
        >
          <div className={classes.toolbar} />
          {drawer}
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <>{children}</>
      </main>
    </div>
  )
}
