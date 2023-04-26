import { Alert, Box, Card, Container, TextField, styled } from '@mui/material'
import { FormEventHandler, useEffect, useState } from 'react'
import Logo from 'components/Logo'
import { useActivateLicenseMutation } from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import useSettings from 'hooks/useSettings'

const StyledPage = styled(Container)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(/teaser.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    opacity: 0.8, // Set opacity to 0.9 to make the background slightly transparent
  },
})

const StyledCard = styled(Card)({
  display: 'flex',
  flexDirection: 'column',
  height: '40vh',
  width: '40vh',
  alignItems: 'center',
  paddingTop: '4vh',
})

export default function Activate() {
  const [create] = useActivateLicenseMutation()
  const { themeStretch } = useSettings()
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
    <StyledPage>
      <StyledCard>
        <Logo width={100} height={100} />
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
      </StyledCard>
    </StyledPage>
  )
}
