import { Box, Button, Container, Typography } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Team } from '../models'

interface Props {
  team?: Team
}

const Dashboard = ({ team }: Props): any => {
  return (
    <Container maxWidth='xs'>
      <Box justifyContent='center' display='flex' alignItems='center' textAlign='center'>
        <Typography variant='h3'>
          Welcome to the team <b>{team ? team.name : 'Admin'}</b> dashboard!
        </Typography>
        {team && (
          <Button
            variant='contained'
            color='primary'
            size='large'
            component={Link}
            to={`/teams/${team.teamId}/create-service`}
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
