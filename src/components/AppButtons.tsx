import { ButtonGroup, IconButton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RLink } from 'react-router-dom'
import { GetAppApiResponse } from 'redux/otomiApi'
import Iconify from './Iconify'

interface Props extends GetAppApiResponse {
  teamId: string
  toggleApp?: any
  externalUrl?: string
  isHostedByOtomi?: boolean
  handleClickModal?: any
}
export default function ({
  id,
  teamId,
  enabled,
  toggleApp,
  externalUrl,
  isHostedByOtomi,
  handleClickModal,
}: Props): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const isAdminApps = teamId === 'admin'

  return (
    <ButtonGroup
      variant='text'
      color='primary'
      size='large'
      disableElevation
      sx={{
        borderColor: 'primary.main',
        backgroundColor: 'transparent',
      }}
    >
      {!isHostedByOtomi && !enabled && isAdminApps && (
        <IconButton
          onClick={() => {
            toggleApp()
          }}
        >
          <Iconify icon='material-symbols:mode-off-on' />
        </IconButton>
      )}

      {enabled && externalUrl && (
        <IconButton component={RLink} to={{ pathname: externalUrl }} target='_blank' onClick={handleClickModal}>
          <Iconify icon='ri:share-forward-line' sx={{ color: '#3682db' }} />
        </IconButton>
      )}

      <IconButton component={RLink} to={`/apps/${teamId}/${id}`} title={t('Click to edit settings')}>
        <Iconify icon='iconamoon:settings' sx={{ color: '#3682db' }} />
      </IconButton>
    </ButtonGroup>
  )
}
