import Brightness3Icon from '@mui/icons-material/Brightness3'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { AppBar, Box, Divider, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getThemeMode, toggleThemeMode } from 'common/theme'
import Menu from 'components/Menu'
import User from 'components/User'
import { useSession } from 'providers/Session'
import { useTheme } from 'providers/Theme'
import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

const drawerWidth = '240px'

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  const appBarColor = p.mode === 'dark' ? p.text.primary : p.common.white
  const appBarIconColor = p.common.white
  return {
    root: {
      display: 'flex',
    },
    title: {
      fontFamily: '"Comfortaa", "Roboto", "Helvetica", "Arial", sans-serif;',
      fontSize: theme.spacing(2.5),
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
      backgroundColor: p.mode === 'dark' ? p.primary.dark : p.primary.main,
      color: appBarColor,
      '.MuiTypography-root': {
        color: appBarColor,
        textTransform: 'none',
      },
      '.MuiIconButton-root': {
        color: appBarIconColor,
      },
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
      // backgroundColor: p.secondary.main,
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
  }
})

const ToolbarOffset = styled('div')(({ theme }) => theme.mixins.toolbar)

interface Props {
  children?: any
  title: string
}

export default function ({ children, title }: Props): React.ReactElement {
  const { oboTeamId } = useSession()
  const { setThemeMode } = useTheme()
  const themeType = getThemeMode()

  const { classes, cx } = useStyles()
  const [open, setOpen] = useState(false)
  const { t, i18n } = useTranslation()
  // END HOOKS
  const handleDrawerOpen = (e) => {
    e.preventDefault()
    if (!open) setOpen(true)
  }
  const handleDrawerClose = (e) => {
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
      {title && <Helmet title={title} />}
      <AppBar position='fixed' className={cx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.logo}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <IconButton>
                {img}
                <Typography className={classes.title}>Otomi Platform</Typography>
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <IconButton onClick={handleDrawerOpen}>{img}</IconButton>
            </Box>
          </div>
          <User />
          <IconButton title={`Toggle theme: ${themeType}`} onClick={toggleTheme}>
            {themeType === 'dark' ? <Brightness3Icon /> : <BrightnessHighIcon />}
          </IconButton>
          {/* <LangSwitcher /> */}
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
        {children}
      </main>
    </div>
  )
}
