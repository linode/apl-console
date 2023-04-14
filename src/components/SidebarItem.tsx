import { forwardRef } from 'react'
// next
// @mui
import { Box, ListItemText, Tooltip, Typography } from '@mui/material'
// guards
// type
import { NavItemProps } from './SidebarTypes'
//
import Iconify from './Iconify'
import { ListItemIconStyle, ListItemStyle, ListItemStyleProps, ListItemTextStyle } from './SidebarStyle'
import SidebarDeployButton from './SidebarDeployButton'
import SidebarRevertButton from './SidebarRevertButton'

// ----------------------------------------------------------------------

// HANDLE SHOW ITEM BY ROLE
const ListItem = forwardRef<HTMLDivElement & HTMLAnchorElement, ListItemStyleProps>((props, ref) => (
  //   <RoleBasedGuard roles={props.roles}>

  //   </RoleBasedGuard>
  <ListItemStyle {...props} ref={ref}>
    {props.children}
  </ListItemStyle>
))

export function SidebarItemRoot({ item, isCollapse, open = false, active, onOpen }: NavItemProps) {
  const { title, path, icon, info, children, disabled, caption, roles } = item

  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle
        disableTypography
        primary={title}
        secondary={
          <Tooltip title={caption} arrow>
            <Typography
              noWrap
              variant='caption'
              component='div'
              sx={{ textTransform: 'initial', color: 'text.secondary' }}
            >
              {caption}
            </Typography>
          </Tooltip>
        }
        isCollapse={isCollapse}
      />
      {!isCollapse && (
        <>
          {info && info}
          {children && <ArrowIcon open={open} />}
        </>
      )}
    </>
  )

  if (children) {
    return (
      <ListItem onClick={onOpen} activeRoot={active} disabled={disabled} roles={roles}>
        {renderContent}
      </ListItem>
    )
  }

  if (title === 'Deploy Changes') return <SidebarDeployButton item={item}>{renderContent}</SidebarDeployButton>
  if (title === 'Revert Changes') return <SidebarRevertButton item={item}>{renderContent}</SidebarRevertButton>

  return (
    <ListItem href={path} onClick={onOpen} activeRoot={active} disabled={disabled} roles={roles}>
      {renderContent}
    </ListItem>
  )
}

// ----------------------------------------------------------------------

type SidebarItemSubProps = Omit<NavItemProps, 'isCollapse'>

export function SidebarItemSub({ item, open = false, active = false, onOpen }: SidebarItemSubProps) {
  const { title, path, icon, info, children, disabled, caption, roles } = item

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Tooltip title={caption || ''} arrow>
            <Typography
              noWrap
              variant='caption'
              component='div'
              sx={{ textTransform: 'initial', color: 'text.secondary' }}
            >
              {caption}
            </Typography>
          </Tooltip>
        }
      />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  )

  if (children) {
    return (
      <ListItem onClick={onOpen} activeSub={active} subItem disabled={disabled} roles={roles}>
        {renderContent}
      </ListItem>
    )
  }

  return (
    <ListItem href={path} activeRoot={active} disabled={disabled} roles={roles}>
      {renderContent}
    </ListItem>
  )
}

// ----------------------------------------------------------------------

type DotIconProps = {
  active: boolean
}

export function DotIcon({ active }: DotIconProps) {
  return (
    <ListItemIconStyle>
      <Box
        component='span'
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main',
          }),
        }}
      />
    </ListItemIconStyle>
  )
}

// ----------------------------------------------------------------------

type ArrowIconProps = {
  open: boolean
}

export function ArrowIcon({ open }: ArrowIconProps) {
  return (
    <Iconify
      icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
      sx={{ width: 16, height: 16, ml: 1 }}
    />
  )
}
