import { Alert, Box, Container, Grid, TextField, Typography, styled } from '@mui/material'
import { FormEventHandler, useEffect, useState } from 'react'
import Logo from 'components/Logo'
import { useActivateLicenseMutation } from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'

const Wrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#2c2e5b',
})

const LeftPanel = styled(Box)({
  background: '#2c2e5b',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
})

const RightPanel = styled(Box)({
  background: 'white',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
})

export default function Activate() {
  const [create] = useActivateLicenseMutation()
  const [jwt, setJwt] = useState('')
  const [loading, setLoading] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)
  const history = useHistory()

  useEffect(() => {
    // Store the current body background color
    const originalBodyBackgroundColor = document.body.style.backgroundColor

    // Set the body background color to white
    document.body.style.backgroundColor = 'white'

    // Restore the original background color on unmount
    return () => {
      document.body.style.backgroundColor = originalBodyBackgroundColor
    }
  }, [])

  const handleActivateLicense: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    setLoading(true)
    setIsInvalid(false)

    create({ body: { jwt } })
      .then((result) => {
        setLoading(false)
        if ('data' in result && result.data.isValid) history.push('/')
        else setIsInvalid(true)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <Wrapper>
      <Container maxWidth='sm'>
        <Grid container>
          <Grid item xs={24} sm={12}>
            <LeftPanel>
              <Logo width={100} height={100} />
            </LeftPanel>
          </Grid>
          <Grid item xs={24} sm={12}>
            <RightPanel>
              <Typography variant='h4' gutterBottom>
                Activate Otomi
              </Typography>
              <form onSubmit={handleActivateLicense}>
                <TextField
                  fullWidth
                  margin='normal'
                  label='Your key'
                  variant='outlined'
                  value={jwt}
                  onChange={(event) => setJwt(event.target.value)}
                />
                {isInvalid && <Alert severity='error'>Invalid key</Alert>}

                <Box marginTop={2}>
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
            </RightPanel>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  )
}
