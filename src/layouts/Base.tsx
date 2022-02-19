import { Box, Typography, Toolbar, IconButton, AppBar, Drawer, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useState } from 'react'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'
import Brightness3Icon from '@mui/icons-material/Brightness3'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { toggleThemeMode } from 'common/theme'
import { makeStyles } from 'tss-react/mui'
import { useSession } from 'common/session-context'
import Menu from 'components/Menu'
import User from 'components/User'

const drawerWidth = '240px'

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
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
    paddingRight: theme.spacing(3),
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // minHeight: theme.spacing(8),
    // maxHeight: theme.spacing(8),
    // [theme.breakpoints.down('sm')]: {
    //   minHeight: theme.spacing(7),
    //   maxHeight: theme.spacing(7),
    // },
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
    zIndex: 1300,
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
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}))

const ToolbarOffset = styled('div')(({ theme }) => theme.mixins.toolbar)

interface Props {
  children?: any
}

export default (props: Props): React.ReactElement => {
  const { children } = props
  const { oboTeamId, themeType, setThemeMode } = useSession()

  const { classes, cx } = useStyles()
  const [open, setOpen] = useState(false)
  const handleDrawerOpen = e => {
    e.preventDefault()
    if (!open) setOpen(true)
  }
  const handleDrawerClose = e => {
    e.preventDefault()
    setOpen(false)
  }
  const toggleTheme = (): void => {
    setThemeMode(toggleThemeMode())
  }

  const img = (
    <img
      style={{ marginRight: '1vw' }}
      // eslint-disable-next-line global-require
      src='/logos/otomi_logo.svg'
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

  return (
    <div className={classes.root}>
      <AppBar position='fixed' className={cx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.logo}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <IconButton color='inherit'>
                {img}
                <Typography className={classes.title} variant='h6'>
                  otomi console
                </Typography>
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton onClick={handleDrawerOpen}>{img}</IconButton>
            </Box>
          </div>
          <User />
          <IconButton color='inherit' title={`Toggle theme: ${themeType}`} onClick={toggleTheme}>
            {themeType === 'dark' ? <Brightness3Icon /> : <BrightnessHighIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Drawer
          variant='temporary'
          className={classes.drawer}
          classes={{
            paper: cx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          open={open}
          onClick={handleDrawerOpen}
          data-cy='drawer-small-screen'
        >
          <ToolbarOffset className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </ToolbarOffset>
          {drawer}
          <Divider />
        </Drawer>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Drawer
          className={classes.drawer}
          variant='permanent'
          classes={{
            paper: cx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          data-cy='drawer-big-screen'
        >
          <ToolbarOffset />
          {drawer}
        </Drawer>
      </Box>
      <main className={classes.content}>
        <ToolbarOffset />
        <>{children}</>
      </main>
    </div>
  )
}
