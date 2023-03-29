import React, { useEffect } from 'react'
import { Container, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

interface Props {
  message: string
  eta?: string
  signoff?: string
}

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'grid',
    flexDirection: 'column',
    alignItems: 'end',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
  },
  article: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: '45px',
    marginBottom: '35px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '30vw',
    minwWidth: '600px',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    marginTop: '17px',
  },
  message: {
    fontSize: '1.2rem',
    margin: '1rem 0',
    textAlign: 'center',
    width: '100%',
  },
  signoff: {
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
    marginLeft: '18%',
  },
  eta: {
    fontSize: '1.5rem',
    fontWeight: 600,
    margin: '1rem 0',
    textAlign: 'center',
    width: '100%',
  },
}))

export default function Maintenance({
  eta,
  message = 'We got this under control, yo.',
  signoff = 'Team Admin',
}: Props): React.ReactElement {
  const { classes } = useStyles()

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

  return (
    <Container className={classes.root}>
      <Container className={classes.article}>
        <Typography variant='h3' className={classes.header} id='header'>
          Otomi is under maintenance
        </Typography>
        <div className={classes.content}>
          {message && (
            <Typography variant='subtitle1' className={classes.message} id='message'>
              {message}
            </Typography>
          )}
          {message && (
            <Typography variant='overline' className={classes.signoff} id='signoff'>
              — {signoff}
            </Typography>
          )}
        </div>
        {eta && (
          <Typography variant='h6' className={classes.eta} id='eta'>
            ETA: {eta}
          </Typography>
        )}
      </Container>
      <div className={classes.logo}>
        <img src='/logos/otomi_logo.svg' alt='Otomi Logo' width='45px' />
      </div>
    </Container>
  )
}
