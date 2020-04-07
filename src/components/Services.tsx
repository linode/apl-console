import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { RLink } from './Link'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table'

const getServiceLink = (row): any => {
  const link = `/teams/${row.teamId}/services/${row.name}`
  return <RLink to={link}>{row.name}</RLink>
}

// const getPublicUrl = (row): any => {
//   if (isEmpty(row.ingress)) {
//     return '-'
//   }
//   return `${row.ingress.domain}`
// }

interface Props {
  services: any[]
  teamId?: string
  sessTeamId?: string
  isAdmin: boolean
}

export default ({ services, teamId, sessTeamId, isAdmin }: Props): any => {
  return (
    <div className='Services'>
      <h1>Services</h1>
      <Box mb={1}>
        <Button
          component={Link}
          to='/create-service'
          startIcon={<AddCircleIcon />}
          variant='contained'
          color='primary'
          disabled={!sessTeamId}
        >
          Create service
        </Button>
      </Box>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell align='right'>Cluster</TableCell>
              {(isAdmin || !teamId) && <TableCell align='right'>Team</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((row): any => (
              <TableRow key={row.name}>
                <TableCell component='th' scope='row'>
                  {getServiceLink(row)}
                </TableCell>
                <TableCell align='right'>{row.clusterId}</TableCell>
                {(isAdmin || !teamId) && <TableCell align='right'>{row.teamId}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
