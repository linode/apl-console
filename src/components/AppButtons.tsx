import { ButtonGroup, IconButton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RLink } from 'react-router-dom'
import { GetTeamAppApiResponse } from 'redux/otomiApi'
import Iconify from './Iconify'

interface Props extends GetTeamAppApiResponse {
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
        borderColor: 'divider',
        borderRadius: 0,
        backgroundColor: 'transparent',
        '& .MuiIconButton-root': {
          color: 'cm.linkActiveLight',
          borderRadius: 0,
          '&:hover': {
            color: 'cm.buttonPrimaryHover',
          },
          '&.Mui-disabled': {
            color: 'action.disabled',
          },
        },
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
          <Iconify icon='ri:share-forward-line' />
        </IconButton>
      )}

      <IconButton component={RLink} to={`/apps/${teamId}/${id}`} title={t('Click to edit settings')}>
        <Iconify icon='iconamoon:settings' />
      </IconButton>
    </ButtonGroup>
  )
}
