import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button } from '@mui/material'
import { useConnectCloudttyMutation } from 'redux/otomiApi'
import { useSession } from 'providers/Session'
import LoadingScreen from './LoadingScreen'

interface Props {
  teamId: string
}

export default function ({ teamId }: Props): React.ReactElement {
  const { t } = useTranslation()
  const { user } = useSession()
  console.log('user', user)
  const [connect, { isLoading, isSuccess, data }] = useConnectCloudttyMutation()
  console.log('connectData', data)

  const hostname = window.location.hostname

  // END HOOKS
  const handleTty = () => {
    connect({ body: { teamId, domain: hostname, sub: user.sub } })
  }

  return (
    <Box>
      {isLoading && <LoadingScreen />}

      {isSuccess ? (
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            paddingTop: '56.25%',
          }}
        >
          <iframe
            title='Test iFrame'
            src={data.iFrameUrl}
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }}
          />
        </Box>
      ) : (
        <Button variant='outlined' onClick={handleTty}>
          Get Cloud TTY
        </Button>
      )}
    </Box>
  )
}
