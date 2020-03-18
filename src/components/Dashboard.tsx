import { Box, Button, Container, Typography as Text } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { createClasses } from './../theme'

const Dashboard = (): any => {
  const classes = createClasses({
    fullHeight: {
      minHeight: '100vh',
    },
  })

  return (
    <Container maxWidth='xs'>
      <Box justifyContent='center' display='flex' alignItems='center' textAlign='center' className={classes.fullHeight}>
        <Button
          variant='contained'
          color='primary'
          size='large'
          component={Link}
          to='/create-app'
          startIcon={<AddIcon />}
        >
          Add your first app!
        </Button>
      </Box>
    </Container>
  )
}

export default Dashboard
