import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import OLink from './Link'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table'

const getServiceLink = (row): any => {
  const link = `/teams/${row.teamId}/services/${row.name}`
  return <OLink to={link}>{row.name}</OLink>
}

// const getPublicUrl = (row): any => {
//   if (isEmpty(row.ingress)) {
//     return '-'
//   }
//   return `${row.ingress.domain}`
// }

interface Props {
  services: any[]
  teamId: string
}

export default ({ services, teamId }: Props): any => {
  return (
    <div className='Services'>
      <h1>Services</h1>
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
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell align='right'>Cluster</TableCell>
              {!teamId && <TableCell align='right'>Team</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((row): any => (
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
