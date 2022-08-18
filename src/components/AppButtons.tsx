import { PlayCircleFilled as PlayIcon, Settings as SettingsIcon } from '@mui/icons-material'
import { ButtonGroup, Checkbox, IconButton, Link } from '@mui/material'
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
  const { externalUrl } = getAppData(session, teamId, id)
  const { t } = useTranslation()
  // END HOOKS
  const isAdminApps = teamId === 'admin'
  const playButtonProps = { LinkComponent: Link, href: externalUrl, target: '_blank', rel: 'noopener' }
  const handleAppsToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked
    const { deps } = getAppData(session, teamId, id)
    setAppState([(deps || []).concat([id]), enabled])
  }

  return (
    <ButtonGroup
      variant='contained'
      color='primary'
      size='large'
      disableElevation
      sx={{
        backgroundColor: 'primary.main',
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
      {externalUrl && (
        <IconButton size='large' {...playButtonProps} disabled={!enabled} title={t('Click to play')}>
          <PlayIcon
            sx={{
              color: !enabled ? 'action.disabled' : 'white',
            }}
          />
        </IconButton>
      )}
      {!hideSettings && (
        <IconButton
          component={RLink}
          to={`/apps/${teamId}/${id}#values`}
          size='large'
          disabled={!enabled}
          title={t('Click to edit values')}
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
