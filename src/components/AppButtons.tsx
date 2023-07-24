import { ButtonGroup, IconButton } from '@mui/material'
import useAuthzSession from 'hooks/useAuthzSession'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RLink } from 'react-router-dom'
import { GetAppApiResponse } from 'redux/otomiApi'
import { getAppData } from 'utils/data'
import Iconify from './Iconify'

// const useAppButtonStyles = makeStyles()((theme) => ({
//   root: {
//     color: theme.palette.
//   }
// }))

interface Props extends GetAppApiResponse {
  teamId: string
  setAppState: CallableFunction
  setDeps: CallableFunction
  hideEnabled?: boolean
  hideSettings?: boolean
  toggleApp?: any
  appTitle?: string
  isHostedByOtomi?: boolean
  externalUrl?: string
}
export default function ({
  id,
  teamId,
  enabled,
  setAppState,
  setDeps,
  hideEnabled = true,
  hideSettings = false,
  toggleApp,
  appTitle,
  isHostedByOtomi,
  externalUrl,
}: Props): React.ReactElement {
  const session = useAuthzSession()

  const { t } = useTranslation()
  // END HOOKS
  const isAdminApps = teamId === 'admin'
  const handleAppsToggle = () => {
    toggleApp()
    const { deps } = getAppData(session, teamId, id)
    console.log('id: ', id)
    setAppState([[id], !enabled])
    if (deps) setAppState([(deps || []).concat([id]), true])
  }

  return (
    <ButtonGroup
      variant='text'
      color='primary'
      size='large'
      disableElevation
      sx={{
        borderColor: 'primary.main',
        backgroundColor: 'transparent',
        paddingBottom: '10px',
      }}
    >
      {!isHostedByOtomi && enabled && (
        <IconButton
          onClick={() => {
            handleAppsToggle()
          }}
        >
          <Iconify icon='material-symbols:mode-off-on' />
        </IconButton>
      )}

      {enabled && externalUrl && (
        <IconButton component={RLink} to={{ pathname: externalUrl }} target='_blank'>
          <Iconify icon='ri:share-forward-fill' />
        </IconButton>
      )}

      <IconButton component={RLink} to={`/apps/${teamId}/${id}`} title={t('Click to edit settings')}>
        <Iconify icon='material-symbols:settings' />
      </IconButton>
    </ButtonGroup>
  )
}
