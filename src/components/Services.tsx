import { Box, Button } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { isEmpty } from 'lodash/lang'
import React from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'

const getServiceLink = (row): any => {
  const link = `/teams/${row.teamId}/services/${row.name}`
  return <Link to={link}>{row.name}</Link>
}

// const getPublicUrl = (row): any => {
//   if (isEmpty(row.ingress)) {
//     return '-'
//   }
//   return `${row.ingress.domain}`
// }

export default ({ services, teamId }): any => {
  return (
    <div className='Services'>
      <Box mb={1}>
        <Button
          component={Link}
          to={`/teams/${teamId}/create-service`}
          startIcon={<AddCircleIcon />}
          variant='contained'
          color='primary'
          disabled={!teamId}
        >
          Create service
        </Button>
      </Box>
      <h2>Services</h2>
      <TableContainer component={Paper}>
        {/* <Table className={classes.table} aria-label='simple table'> */}
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell align='right'>Cluster</TableCell>
              {!teamId && <TableCell align='right'>Team</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map(row => (
              <TableRow key={row.name}>
                <TableCell component='th' scope='row'>
                  {getServiceLink(row)}
                </TableCell>
                <TableCell align='right'>{row.clusterId}</TableCell>
                {!teamId && <TableCell align='right'>{row.teamId}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
