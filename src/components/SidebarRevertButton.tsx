import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useSession } from 'providers/Session'
import { forwardRef, useEffect, useState } from 'react'
import { useDeployQuery, useRevertQuery } from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import snack from 'utils/snack'
import { SnackbarKey } from 'notistack'
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

export default function SidebarRevertButton({ item, children }: Props) {
  const { title, path, icon, info, disabled, caption, roles } = item
  const [revert, setRevert] = useState(false)
  const [deploy, setDeploy] = useState(false)
  const [keys] = useState<Record<string, SnackbarKey | undefined>>({})

  const closeKey = (key) => {
    if (!keys[key]) return
    snack.close(keys[key])
    delete keys[key]
  }
  const { t } = useTranslation()
  const { corrupt, editor } = useSession()

  const {
    isSuccess: okDeploy,
    error: errorDeploy,
    isFetching: isDeploying,
  }: any = useDeployQuery(!deploy ? skipToken : undefined)

  const {
    isSuccess: okRevert,
    error: errorRevert,
    isFetching: isReverting,
  }: any = useRevertQuery(!revert ? skipToken : undefined)

  useEffect(() => {
    if (revert) {
      keys.revert = snack.info(`${t('Reverting... Hold on!')}`, {
        persist: true,
        key: keys.revert,
        onClick: () => {
          closeKey('revert')
        },
      })
      if (okRevert || errorRevert) {
        snack.close(keys.revert)
        if (errorRevert) snack.error(`${t('Reverting failed. Please contact support@redkubes.com.')}`)
        setRevert(false)
      }
    }
  }, [revert, okRevert, errorRevert])

  const handleRevertClick = (): void => {
    setRevert(true)
  }

  return (
    <ListItem
      onClick={() => {
        handleRevertClick()
      }}
      disabled={!editor || isDeploying || isReverting || corrupt}
      roles={roles}
      sx={{
        '&:hover': {
          color: 'white',
          backgroundColor: '#f6d10c',
        },
      }}
    >
      {children}
    </ListItem>
  )
}
