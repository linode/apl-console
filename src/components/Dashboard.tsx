import { Box, Button, Container, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'

interface Props {
  teamId: string
}

const Dashboard = ({ teamId }: Props): any => {
  const { isAdmin } = useSession()

  return (
    <Container maxWidth='xs'>
      <Box justifyContent='center' display='flex' alignItems='center' textAlign='center'>
        <Typography variant='h3'>
          Welcome to the team <b>{isAdmin ? 'Admin' : teamId.charAt(0).toUpperCase() + teamId.substr(1)}</b> dashboard!
        </Typography>
        {!isAdmin && (
          <Button
            variant='contained'
            color='primary'
            size='large'
            component={Link}
            to={`/teams/${teamId}/create-service`}
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
