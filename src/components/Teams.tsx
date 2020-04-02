import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'

const getTeamLink = (row, rowIndex): any => {
  return <Link to={`/teams/${row.name}`}>{row.name}</Link>
}

const TeamActionBar = (): any => {
  return (
    <Box mb={1}>
      <Button
        component={Link}
        to='/create-team'
        startIcon={<AddCircleIcon />}
        variant='contained'
        color='primary'
        className={'createTeam'}
      >
        Create team
      </Button>
    </Box>
  )
}

export default ({ teams }): any => {
  const { isAdmin } = useSession()

  return (
    <div className='Teams'>
      <h2>Teams</h2>
      {isAdmin && <TeamActionBar />}
      <TableContainer component={Paper}>
        {/* <Table className={classes.table} aria-label='simple table'> */}
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Team Name</TableCell>
              <TableCell align='right'>Clusters</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((row, id) => (
              <TableRow key={row.name}>
                <TableCell component='th' scope='row' id={row.teamId}>
                  {getTeamLink(row, id)}
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
