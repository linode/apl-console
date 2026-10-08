import { forwardRef } from 'react'
import { alpha, styled } from '@mui/material/styles'
import useShellDrawer from 'hooks/useShellDrawer'
import { ListItemStyle, ListItemStyleProps } from './SidebarStyle'

const StyledListItem = styled(ListItemStyle)(({ theme, activeRoot }) => ({
  borderRadius: 0,
  boxShadow: 'none',
  fontFamily: theme.font.normal,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  ...(activeRoot && {
    color: theme.palette.cm.linkActiveLight,
    backgroundColor: alpha(theme.palette.cm.linkActiveLight as string, theme.palette.action.selectedOpacity as number),
  }),
  '&:hover:not(.Mui-disabled)': {
    color: theme.palette.cm.buttonPrimaryHover,
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiTypography-root': {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
  },
}))

const ListItem = forwardRef<HTMLDivElement & HTMLAnchorElement, ListItemStyleProps>((props, ref) => (
  <StyledListItem {...props} ref={ref}>
    {props.children}
  </StyledListItem>
))

interface Props {
  item: any
  children: any
  disabled: boolean
}

export default function SidebarShellButton({ item, children, disabled }: Props) {
  const { roles } = item
  const { isShell, onOpenShell } = useShellDrawer()

  const handleShellClick = (): void => {
    onOpenShell()
  }

  return (
    <ListItem
      onClick={() => {
        handleShellClick()
      }}
      roles={roles}
      activeRoot={isShell}
      disabled={disabled}
    >
      {children}
    </ListItem>
  )
}
