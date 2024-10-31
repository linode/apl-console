import React, { useState } from 'react'
import Helmet from 'react-helmet'
import Sidebar from 'components/Sidebar'
import Header from 'components/Header'
import useCollapseDrawer from 'hooks/useCollapseDrawer'
import useShellDrawer from 'hooks/useShellDrawer'
import { Box, styled } from '@mui/material'
import { HEADER, NAVBAR } from '../config'
import Shell from './Shell'

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
  const { isShell, shellHeight } = useShellDrawer()
  const [open, setOpen] = useState(false)

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
        pb: `${shellHeight}px`,
      }}
    >
      {title && <Helmet title={title} />}
      <Header isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />
      <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle collapseClick={collapseClick}>{children}</MainStyle>
      {isShell && <Shell collapseClick={collapseClick} />}
    </Box>
  )
}
