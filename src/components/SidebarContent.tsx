import { Box, Divider, List, ListSubheader } from '@mui/material'
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

const SidebarDivider = styled(Divider)`
  border-color: rgb(34, 34, 34);
  margin: 11px 0px;
`

const FirstSidebarDivider = styled(SidebarDivider)`
  margin-top: 0;
`

// ----------------------------------------------------------------------

export default function SidebarContent({ navConfig, isCollapse = false, ...other }: NavSectionProps) {
  const { oboTeamId, user } = useSession()
  const { themeView } = useSettings()

  const { isPlatformAdmin } = user

  navConfig = navConfig.filter((group) => {
    const subheader = group.subheader.toLowerCase()
    if (isPlatformAdmin) {
      return (
        subheader === 'actions' || subheader.includes(themeView) || (themeView === 'team' && subheader === 'access')
      )
    }
    return subheader !== 'platform'
  })

  return (
    <Box {...other}>
      {navConfig.map((group, index) => (
        <List key={group.subheader} disablePadding>
          {index === 0 ? <FirstSidebarDivider /> : <SidebarDivider />}
          {group.items.map((list) => {
            if (oboTeamId === 'admin' && list.hidden) return null
            return <SidebarListRoot key={list.title + list.path} list={list} isCollapse={isCollapse} />
          })}
        </List>
      ))}
    </Box>
  )
}
