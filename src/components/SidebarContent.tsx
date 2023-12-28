import { Box, List, ListSubheader } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useSession } from 'providers/Session'
import useSettings from 'hooks/useSettings'
import { SidebarListRoot } from './SidebarList'
import { NavSectionProps } from './SidebarTypes'

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  }),
)

// ----------------------------------------------------------------------

export default function SidebarContent({ navConfig, isCollapse = false, ...other }: NavSectionProps) {
  const { oboTeamId, user } = useSession()
  const { themeView } = useSettings()

  const { isAdmin } = user

  if (!isAdmin) navConfig = navConfig.filter((group) => group.subheader !== 'platform')
  else {
    navConfig = navConfig.filter(
      (group) => group.subheader.toLowerCase() === 'actions' || group.subheader.toLowerCase().includes(themeView),
    )
  }

  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          {group.subheader !== 'actions' && (
            <ListSubheaderStyle
              sx={{
                ...(isCollapse && {
                  opacity: 0,
                }),
              }}
            >
              {group.subheader}
            </ListSubheaderStyle>
          )}
          {group.items.map((list) => {
            if (oboTeamId === 'admin' && list.dontShowIfAdminTeam) return null

            return <SidebarListRoot key={list.title + list.path} list={list} isCollapse={isCollapse} />
          })}
        </List>
      ))}
    </Box>
  )
}
