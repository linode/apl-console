import { Alert, Box, Card, Container, TextField, Typography, styled } from '@mui/material'
import { FormEventHandler, useState } from 'react'
import Logo from 'components/Logo'
import { useActivateLicenseMutation } from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import useSettings from 'hooks/useSettings'
import snack from 'utils/snack'

const StyledPage = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
})

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  height: '36vh',
  width: '40vh',
  alignItems: 'center',
  padding: '4vh',
})

export default function Activate() {
  const [create] = useActivateLicenseMutation()
  const { themeStretch } = useSettings()
  const [jwt, setJwt] = useState('')
  const [loading, setLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const history = useHistory()

  const handleActivateLicense: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    setLoading(true)
    setIsInvalid(false)

    create({ body: { jwt } })
      .then((result) => {
        setLoading(false)
        if ('data' in result && result.data.isValid) history.push('/')
        else snack.error('License is invalid')
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <StyledPage>
      <Logo width={100} height={100} sx={{ position: 'absolute', top: '10px', left: '10px' }} />
      <Logo
        width={1000}
        height={1000}
        sx={{ position: 'absolute', right: '-10%', bottom: '-35%', zIndex: -100, opacity: 0.3 }}
      />
      <StyledCard>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
          <Typography variant='h5'>Register your cluster</Typography>
          <Typography sx={{ mt: 2 }}>
            Register a free account at <b>Otomi cloud</b>. From the dashboard click <b> Register cluster </b> and copy
            the api key
          </Typography>
        </Box>
        <Box sx={{ width: '100%', mt: 4 }}>
          <form onSubmit={handleActivateLicense}>
            <TextField
              fullWidth
              label='Your api key'
              variant='outlined'
              value={jwt}
              onChange={(event) => setJwt(event.target.value)}
            />
            {isInvalid && <Alert severity='error'>Invalid key</Alert>}

            <Box marginTop={5}>
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
      </StyledCard>
    </StyledPage>
  )
}
