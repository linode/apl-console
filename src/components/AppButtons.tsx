import { Settings as SettingsIcon } from '@mui/icons-material'
import { ButtonGroup, IconButton } from '@mui/material'
import useAuthzSession from 'hooks/useAuthzSession'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RLink } from 'react-router-dom'
import { GetAppApiResponse } from 'redux/otomiApi'
import { getAppData } from 'utils/data'
import Iconify from './Iconify'

interface Props extends GetAppApiResponse {
  teamId: string
  setAppState: CallableFunction
  hideEnabled?: boolean
  hideSettings?: boolean
  toggleApp?: any
  appTitle?: string
  isHostedByOtomi?: boolean
}
export default function ({
  id,
  teamId,
  enabled,
  setAppState,
  hideEnabled = true,
  hideSettings = false,
  toggleApp,
  appTitle,
  isHostedByOtomi,
}: Props): React.ReactElement {
  const session = useAuthzSession()

  const { t } = useTranslation()
  // END HOOKS
  const isAdminApps = teamId === 'admin'
  const handleAppsToggle = () => {
    console.log('app data in button', id, enabled)
    const { deps } = getAppData(session, teamId, id)
    setAppState([[id], !enabled])
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
      {!isHostedByOtomi ||
        (!enabled && (
          <IconButton
            onClick={() => {
              handleAppsToggle()
            }}
          >
            <Iconify
              icon='material-symbols:mode-off-on'
              sx={{
                color: 'white',
              }}
            />
          </IconButton>
        ))}

      <IconButton component={RLink} to={`/apps/${teamId}/${id}`} title={t('Click to edit settings')}>
        <SettingsIcon
          sx={{
            color: 'white',
          }}
        />
      </IconButton>
    </ButtonGroup>
  )
}
