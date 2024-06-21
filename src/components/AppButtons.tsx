import { ButtonGroup, IconButton, useTheme } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RLink } from 'react-router-dom'
import { GetAppApiResponse } from 'redux/otomiApi'
import { getAppData } from 'utils/data'
import { useSession } from 'providers/Session'
import Iconify from './Iconify'

// const useAppButtonStyles = makeStyles()((theme) => ({
//   root: {
//     color: theme.palette.
//   }
// }))

interface Props extends GetAppApiResponse {
  teamId: string
  setAppState: CallableFunction
  hideEnabled?: boolean
  hideSettings?: boolean
  toggleApp?: any
  appTitle?: string
  isHostedByOtomi?: boolean
  externalUrl?: string
  isDeprecated?: boolean
  handleClickModal?: any
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
  externalUrl,
  isDeprecated,
  handleClickModal,
}: Props): React.ReactElement {
  const session = useSession()
  const theme = useTheme()

  const { t } = useTranslation()
  // END HOOKS
  const isAdminApps = teamId === 'admin'
  const handleAppsToggle = () => {
    toggleApp()
    const { deps } = getAppData(session, teamId, id)
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
      }}
    >
      {!isHostedByOtomi && !enabled && isAdminApps && (
        <IconButton
          onClick={() => {
            handleAppsToggle()
          }}
        >
          <Iconify icon='material-symbols:mode-off-on' />
        </IconButton>
      )}

      {enabled && externalUrl && (
        <IconButton component={RLink} to={{ pathname: externalUrl }} target='_blank' onClick={handleClickModal}>
          <Iconify icon='ri:share-forward-fill' sx={{ color: theme.palette.chart.blue[0] }} />
        </IconButton>
      )}

      <IconButton component={RLink} to={`/apps/${teamId}/${id}`} title={t('Click to edit settings')}>
        <Iconify icon='material-symbols:settings' sx={{ color: theme.palette.chart.blue[0] }} />
      </IconButton>
    </ButtonGroup>
  )
}
