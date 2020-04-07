import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'
import { RLink } from './Link'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table'

const TeamActionBar = (): any => {
  return (
    <Box mb={1}>
      <Button
        component={Link}
        to='/create-team'
        startIcon={<AddCircleIcon />}
        variant='contained'
        color='primary'
        className='createTeam'
      >
        Create team
      </Button>
    </Box>
  )
}

interface Props {
  teams: any[]
}

export default ({ teams }: Props): any => {
  const { isAdmin } = useSession()

  return (
    <div className='Teams'>
      <h1>Teams</h1>
      {isAdmin && <TeamActionBar />}
      <TableContainer>
        {/* <Table className={classes.table} aria-label='simple table'> */}
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell align='right'>Clusters</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map(row => (
              <TableRow key={row.name}>
                <TableCell component='th' scope='row' id={row.teamId}>
                  <RLink to={`/teams/${row.name}`}>{row.name}</RLink>
                </TableCell>
                <TableCell align='right'>{row.clusters.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
