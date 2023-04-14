import { Box, Drawer, Stack, styled, useTheme } from '@mui/material'
import useCollapseDrawer from 'hooks/useCollapseDrawer'
import cssStyles from 'utils/cssStyles'
import useResponsive from 'hooks/useResponsive'
import { NAVBAR } from '../config'
import CollapseButton from './CollapseButton'
import Scrollbar from './Scrollbar'
import Logo from './Logo'
import SidebarContent from './SidebarContent'
import navConfig from './NavConfig'

// --- styles -----------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}))

// --- JSX --------------------------------------------------------------

type Props = {
  isOpenSidebar: boolean
  onCloseSidebar: VoidFunction
}

export default function Sidebar({ isOpenSidebar, onCloseSidebar }: Props) {
  const theme = useTheme()
  const isDesktop = useResponsive('up', 'lg')
  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } = useCollapseDrawer()

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' }),
        }}
      >
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Logo
            sx={{
              transition: 'all .2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
          )}
        </Stack>

        {/* <NavbarAccount isCollapse={isCollapse} /> */}
      </Stack>

      <SidebarContent navConfig={navConfig()} isCollapse={isCollapse} />
      {/* <Menu teamId={oboTeamId} /> */}
      {/* <NavSectionVertical navConfig={navConfig} isCollapse={isCollapse} /> */}

      <Box sx={{ flexGrow: 1 }} />

      {/* {!isCollapse && <NavbarDocs />} */}
    </Scrollbar>
  )

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant='persistent'
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  )
}
