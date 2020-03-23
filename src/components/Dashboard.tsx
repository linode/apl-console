import { Box, Button, Container, Typography as Text } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'
import { createClasses } from './../theme'

const Dashboard = ({ teamName }): any => {
  const { isAdmin } = useSession()

  const classes = createClasses({
    root: {
      // minHeight: '100vh',
    },
  })

  return (
    <Container maxWidth='xs'>
      <Box justifyContent='center' display='flex' alignItems='center' textAlign='center' className={classes.root}>
        <h3>
          Welcome to the <b>team {teamName}</b> dashboard!
        </h3>
        {!isAdmin && (
          <Button
            variant='contained'
            color='primary'
            size='large'
            component={Link}
            to={`/teams/${teamName}/create-service`}
            startIcon={<AddIcon />}
          >
            Create a new Service!
          </Button>
        )}
      </Box>
    </Container>
  )
}

export default Dashboard
