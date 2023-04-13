import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import ErrorComponent from 'components/Error'
import { ErrorBoundary } from 'react-error-boundary'
import Helmet from 'react-helmet'
import { useHistory } from 'react-router-dom'
import Sidebar from 'components/Sidebar'
import Header from 'components/Header'
import useCollapseDrawer from 'hooks/useCollapseDrawer'
import { Box, styled } from '@mui/material'
import { HEADER, NAVBAR } from '../config'

// ----------------------------------------------------------------------

type MainStyleProps = {
  collapseClick: boolean
}

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<MainStyleProps>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}))

// ----------------------------------------------------------------------
interface Props {
  children?: any
  title: string
}

export default function ({ children, title }: Props): React.ReactElement {
  const { collapseClick, isCollapse } = useCollapseDrawer()
  const session = useSession()
  const history = useHistory()
  const [open, setOpen] = useState(false)

  const verticalLayout = 'vertical'

  // useEffect(() => {
  //   if (session && !session.license) {
  //     // Redirect to /activate
  //     history.push('/activate')
  //   }
  // }, [session, history])

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      {title && <Helmet title={title} />}
      {/* <AppBar position='fixed' className={cx(classes.appBar, open && classes.appBarShift)}>
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
          <Header />
        </Toolbar>
      </AppBar> */}
      <Header isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} verticalLayout />
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle collapseClick={collapseClick}>
        <ErrorBoundary FallbackComponent={ErrorComponent}>{children}</ErrorBoundary>
      </MainStyle>
    </Box>
  )
}
