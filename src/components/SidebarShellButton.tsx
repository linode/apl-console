import { forwardRef } from 'react'
import useShellDrawer from 'hooks/useShellDrawer'
import { ListItemStyle, ListItemStyleProps } from './SidebarStyle'

const ListItem = forwardRef<HTMLDivElement & HTMLAnchorElement, ListItemStyleProps>((props, ref) => (
  <ListItemStyle {...props} ref={ref}>
    {props.children}
  </ListItemStyle>
))

interface Props {
  item: any
  children: any
}

export default function SidebarShellButton({ item, children }: Props) {
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
    >
      {children}
    </ListItem>
  )
}
