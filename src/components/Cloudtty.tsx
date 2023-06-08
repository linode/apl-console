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
  const domain = hostname.split('.').slice(1).join('.') || hostname

  const [myUrl, setMyUrl] = React.useState('')
  const [url, setUrl] = React.useState(`https://tty.${domain}/${user.sub}`)

  // END HOOKS
  const handleTty = () => {
    connect({ body: { teamId, domain, sub: user.sub } })
  }

  const handleSetMyUrl = () => {
    setMyUrl(url)
  }

  return (
    <Box>
      {isLoading && <LoadingScreen />}

      {isSuccess ? (
        <>
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
              src={myUrl || data.iFrameUrl}
              style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }}
            />
          </Box>
          <input style={{ width: '100%' }} type='text' value={url} onChange={(e) => setUrl(e.target.value)} />
          <button style={{ width: '100%' }} type='button' onClick={handleSetMyUrl}>
            Set My URL
          </button>
        </>
      ) : (
        <Button variant='outlined' onClick={handleTty}>
          Get Cloud TTY
        </Button>
      )}
    </Box>
  )
}
