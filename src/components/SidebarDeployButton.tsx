import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useSession } from 'providers/Session'
import { forwardRef, useEffect, useState } from 'react'
import { useDeployQuery } from 'redux/otomiApi'
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

export default function SidebarDeployButton({ item, children }: Props) {
  const { title, path, icon, info, disabled, caption, roles } = item
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

  useEffect(() => {
    if (deploy) {
      keys.deploy = snack.info(`${t('Scheduling... Hold on!')}`, {
        persist: true,
        key: keys.deploy,
        onClick: () => closeKey('deploy'),
      })
      if (okDeploy || errorDeploy) {
        snack.close(keys.deploy)
        if (errorDeploy) snack.warning(`${t('Deployment failed. Potential conflict with another editor.')}`)
        setDeploy(false)
      }
    }
  }, [deploy, okDeploy, errorDeploy])

  const handleDeployClick = (): void => {
    setDeploy(true)
  }

  return (
    <ListItem
      onClick={() => {
        handleDeployClick()
      }}
      disabled={!editor || isDeploying || corrupt}
      roles={roles}
      sx={{
        mt: 3,
        backgroundColor: !(!editor || isDeploying || corrupt) && '#fb2f30',
        color: !(!editor || isDeploying || corrupt) && 'white',
        transform: 'scale(1)',
        animation: !(!editor || isDeploying || corrupt) && 'pulse 2s infinite',
        boxShadow: '0 0 0 0 rgba(255, 0, 0, 1)',
        '&:hover': {
          backgroundColor: '#fb2f30',
        },
      }}
    >
      {children}
    </ListItem>
  )
}
