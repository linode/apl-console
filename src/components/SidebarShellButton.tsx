import { forwardRef } from 'react'
import useShellDrawer from 'hooks/useShellDrawer'
import { ListItemStyle, ListItemStyleProps } from './SidebarStyle'

// HANDLE SHOW ITEM BY ROLE
const ListItem = forwardRef<HTMLDivElement & HTMLAnchorElement, ListItemStyleProps>((props, ref) => (
  //   <RoleBasedGuard roles={props.roles}>

  //   </RoleBasedGuard>
  <ListItemStyle {...props} ref={ref}>
    {props.children}
  </ListItemStyle>
))

interface Props {
  item: any
  children: any
}

export default function SidebarShellButton({ item, children }: Props) {
  const { title, path, icon, info, disabled, caption, roles } = item
  const { isShell, onOpenShell } = useShellDrawer()

  const handleShellClick = (): void => {
    onOpenShell()
  }

  return (
    <ListItem
      onClick={() => {
        handleShellClick()
      }}
      // disabled={!editor || isDeploying || isReverting || corrupt}
      roles={roles}
      activeRoot={isShell}
    >
      {children}
    </ListItem>
  )
}
