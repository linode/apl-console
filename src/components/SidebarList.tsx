/* eslint-disable import/prefer-default-export */
// @mui
// type
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Collapse, List } from '@mui/material'
import { NavListProps } from './SidebarTypes'
//
import { SidebarItemRoot, SidebarItemSub } from './SidebarItem'

// ----------------------------------------------------------------------

type NavListRootProps = {
  list: NavListProps
  isCollapse: boolean
}

export function SidebarListRoot({ list, isCollapse }: NavListRootProps) {
  const { pathname } = useLocation()

  const active = pathname === list.path

  const [open, setOpen] = useState(active)

  const hasChildren = list.children

  if (hasChildren) {
    return (
      <>
        <SidebarItemRoot
          item={list}
          isCollapse={isCollapse}
          active={active}
          open={open}
          onOpen={() => setOpen(!open)}
        />

        {!isCollapse && (
          <Collapse in={open} timeout='auto' unmountOnExit>
            <List component='div' disablePadding sx={{ ml: 3 }}>
              {(list.children || []).map((item) => (
                <SidebarListSub key={item.title + item.path} list={item} />
              ))}
            </List>
          </Collapse>
        )}
      </>
    )
  }

  return <SidebarItemRoot item={list} active={active} isCollapse={isCollapse} />
}

// ----------------------------------------------------------------------

type SidebarListSubProps = {
  list: NavListProps
}

function SidebarListSub({ list }: SidebarListSubProps) {
  const { pathname } = useLocation()

  const active = pathname === list.path

  const [open, setOpen] = useState(active)

  const hasChildren = list.children

  if (hasChildren) {
    return (
      <>
        <SidebarItemSub item={list} onOpen={() => setOpen(!open)} open={open} active={active} />

        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding sx={{ pl: 3 }}>
            {(list.children || []).map((item) => (
              <SidebarItemSub key={item.title + item.path} item={item} active={active} />
            ))}
          </List>
        </Collapse>
      </>
    )
  }

  return <SidebarItemSub item={list} active={active} />
}
