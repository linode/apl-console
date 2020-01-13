import { Box, Button, Container, Typography as Text } from '@material-ui/core'
import { PlayCircleOutline } from '@material-ui/icons/'
import * as React from 'react'
import { Link } from 'react-router-dom'
import logo from './../images/astroboy.png'
import { createClasses } from './../theme'

export const Home: React.FC = (): any => {
  const classes = createClasses({
    centeredContainer: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '75vh',
    },
    img: {
      display: 'block',
      margin: 'auto',
      maxWidth: '35%',
      width: '130px',
    },
    noUnderline: {
      color: 'black',
      textDecoration: 'none',
    },
    pointer: {
      cursor: 'pointer',
    },
  })

  return (
    <Container maxWidth='xs'>
      <Box textAlign='center'>
        <div className={classes.centeredContainer}>
          <div>
            <Box mb={3}>
              <Link to='/login'>
                <img src={logo} alt='logo' className={`${classes.img} ${classes.pointer}`} />
              </Link>
              <Link to='/login' className={classes.noUnderline}>
                <Text variant='h2' component='h1' className={classes.pointer}>
                  Otomi.app
                </Text>
              </Link>
              <Text variant='h5'>All things awesome</Text>
            </Box>
            <Button
              variant='contained'
              color='primary'
              size='large'
              endIcon={<PlayCircleOutline />}
              component={Link}
              to='/login                                                '
            >
              Get started
            </Button>
          </div>
        </div>
      </Box>
    </Container>
  )
}

export default Home
