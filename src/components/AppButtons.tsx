import { Settings as SettingsIcon } from '@mui/icons-material'
import { ButtonGroup, Checkbox, IconButton } from '@mui/material'
import useAuthzSession from 'hooks/useAuthzSession'
import React, { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RLink } from 'react-router-dom'
import { GetAppApiResponse } from 'redux/otomiApi'
import { getAppData } from 'utils/data'

interface Props extends GetAppApiResponse {
  teamId: string
  setAppState: CallableFunction
  hideEnabled?: boolean
  hideSettings?: boolean
}
export default function ({
  id,
  teamId,
  enabled,
  setAppState,
  hideEnabled = true,
  hideSettings = false,
}: Props): React.ReactElement {
  const session = useAuthzSession()
  const { t } = useTranslation()
  // END HOOKS
  const isAdminApps = teamId === 'admin'
  const handleAppsToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked
    const { deps } = getAppData(session, teamId, id)
    setAppState([(deps || []).concat([id]), enabled])
  }

  return (
    <ButtonGroup
      variant={hideSettings ? 'outlined' : 'contained'}
      color='primary'
      size='large'
      disableElevation
      sx={{
        borderColor: 'primary.main',
        backgroundColor: hideSettings ? 'inherit' : 'primary.main',
      }}
    >
      {!hideEnabled && (
        <Checkbox
          title={t('Click to enable this app')}
          onChange={handleAppsToggle}
          checked={enabled !== false}
          disabled={enabled}
          size='medium'
          sx={{
            color: !isAdminApps || enabled !== false ? 'white' : 'action.disabled',
          }}
        />
      )}
      {!hideSettings && (
        <IconButton
          component={RLink}
          to={`/apps/${teamId}/${id}`}
          size='large'
          disabled={!enabled}
          title={t('Click to edit settings')}
        >
          <SettingsIcon
            sx={{
              color: !enabled ? 'action.disabled' : 'white',
            }}
          />
        </IconButton>
      )}
    </ButtonGroup>
  )
}
