import { Box, Card, Container, TextField, Typography, styled } from '@mui/material'
import { FormEventHandler, useEffect, useState } from 'react'
import Logo from 'components/Logo'
import { useActivateLicenseMutation, useDeleteLicenseMutation } from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import useSettings from 'hooks/useSettings'
import snack from 'utils/snack'
import { useSession } from 'providers/Session'

const StyledPage = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  overflow: 'hidden',
})

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '4vh',
  boxSizing: 'border-box', // Ensures padding is included in width/height calculations
  minWidth: '300px', // Minimum width to ensure content visibility
  width: '50%', // Use 100% of the parent container's width
  minHeight: '370px', // Minimum height to ensure content visibility at different zoom levels
  maxHeight: '90vh', // Use a high percentage of the viewport height to ensure visibility at different zoom levels
  overflow: 'auto', // Enable scroll if the content overflows
})
export default function Activate() {
  const [create] = useActivateLicenseMutation()
  const [del] = useDeleteLicenseMutation()
  const { themeStretch } = useSettings()
  const [jwt, setJwt] = useState('')
  const [loading, setLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const session = useSession()
  const history = useHistory()

  useEffect(() => {
    if (session && session.license?.isValid) {
      // Redirect to /activate
      history.push('/')
    }
  }, [session, history])

  const handleActivateLicense: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    setLoading(true)
    setIsInvalid(false)

    create({ body: { jwt } })
      .then((result) => {
        setLoading(false)
        if ('data' in result && result.data.isValid) setIsValid(true)
        else snack.error('License is invalid')
      })
      .catch(() => {
        setLoading(false)
      })
  }

  // const removeLicense = () => {
  //   console.log('clicked')
  //   del().then((result) => {
  //     console.log('result', result)
  //   })
  // }

  return (
    <StyledPage>
      <Logo width={100} height={100} sx={{ position: 'absolute', top: '10px', left: '10px' }} />
      {/* <Logo
        width={1000}
        height={1000}
        sx={{ position: 'absolute', right: '-10%', bottom: '-35%', zIndex: -100, opacity: 0.3 }}
      /> */}
      <StyledCard>
        {isValid ? (
          <Box>
            <Typography variant='h5'>License uploaded succesfully</Typography>
            <Typography>You will be redirected automatically</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
              <Typography variant='h5'>Register your cluster</Typography>
              <Typography sx={{ mt: 2 }}>
                1) Create a free account at{' '}
                <a
                  style={{ color: 'red', textDecoration: 'none' }}
                  target='_blank'
                  href='https://portal.otomi.cloud'
                  rel='noreferrer'
                >
                  Otomi Cloud
                </a>
              </Typography>
              <Typography sx={{ mt: 2 }}>2) Register your cluster and copy the license key</Typography>
            </Box>
            <Box sx={{ width: '100%', mt: 4 }}>
              <form onSubmit={handleActivateLicense}>
                <TextField
                  fullWidth
                  label='Your license key'
                  variant='outlined'
                  value={jwt}
                  onChange={(event) => setJwt(event.target.value)}
                />

                <Box marginTop={6}>
                  <LoadingButton
                    fullWidth
                    color='primary'
                    variant='contained'
                    type='submit'
                    loading={loading}
                    disabled={!jwt}
                  >
                    Activate
                  </LoadingButton>
                </Box>
              </form>
            </Box>
          </>
        )}
      </StyledCard>
    </StyledPage>
  )
}
