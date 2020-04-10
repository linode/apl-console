/* eslint-disable global-require */
import { Container, makeStyles, Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Badge from '@material-ui/core/Badge'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/Notifications'
import clsx from 'clsx'
import React, { useState } from 'react'
import MenuAdmin from '../components/MenuAdmin'
import MenuTeam from '../components/MenuTeam'
import User from '../components/User'
import { useApi } from '../hooks/api'
import { useSession } from '../session-context'
import { toggleThemeType } from '../theme'

const drawerWidth = '16vw'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    // a: theme.palette.primary.dark,
  },
  logo: {
    flexGrow: 1,
    marginRight: '1vw',
    justifyContent: 'left',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
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
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  drawer: {
    backgroundColor: theme.palette.secondary.main,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
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
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

interface Props {
  children?: any
}

export default (props: Props): any => {
  const { children } = props
  const { isAdmin, teamId, setThemeType } = useSession()
  const classes = useStyles(props)
  const [open, setOpen] = useState(true)
  const [teams]: any = useApi('getTeams')
  const handleDrawerOpen = (): any => {
    setOpen(true)
  }
  const handleDrawerClose = (): any => {
    // setOpen(false)
    setOpen(true)
  }

  const toggleTheme = (): void => {
    setThemeType(toggleThemeType())
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='absolute' className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          <IconButton color='inherit' onClick={toggleTheme} className={classes.logo}>
            <img
              style={{ marginRight: '1vw' }}
              src={require('../images/otomi-stack.png')}
              width='40'
              height='40'
              alt='otomi logo'
            />
            <Typography variant='h5'>Otomi {isAdmin ? 'Admin' : 'Team'} Console</Typography>
          </IconButton>
          <User teams={teams} />
          <IconButton color='inherit'>
            <Badge badgeContent={4} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        className={classes.drawer}
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
        onClick={handleDrawerClose}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{isAdmin && !teamId ? <MenuAdmin /> : <MenuTeam teamId={teamId} />}</List>
        <Divider />
        {/* <List>{secondaryListItems}</List> */}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} component={Paper}>
              {children}
            </Grid>
          </Grid>
          {/* <Box pt={4}>
            <Copyright />
          </Box> */}
        </Container>
      </main>
    </div>
  )
}
