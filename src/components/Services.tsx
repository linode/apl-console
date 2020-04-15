import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { RLink, Link as MuiLink } from './Link'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table'

const getServiceLink = (row): any => {
  const { teamId, clusterId, name } = row
  const link = `/teams/${teamId}/services/${name}?clusterId=${clusterId}`
  return <RLink to={link}>{name}</RLink>
}

const renderPublicUrl = (row): any => {
  if ('internal' in row.ingress) {
    return '-'
  }
  const url = row.ingress.subdomain ? `${row.ingress.subdomain}.${row.ingress.domain}` : row.ingress.domain
  return <MuiLink href={`https://${url}`}>{url}</MuiLink>
}

interface Props {
  services: any[]
  teamId?: string
  sessTeamId?: string
  isAdmin: boolean
}

export default ({ services, teamId, sessTeamId, isAdmin }: Props): any => {
  const showTeam = !teamId

  return (
    <div className='Services'>
      <h1>Services{teamId ? `: Team ${teamId.charAt(0).toUpperCase() + teamId.substr(1)}` : ''}</h1>
      <Box mb={1}>
        {(isAdmin || teamId) && (
          <Button
            component={Link}
            to={isAdmin ? '/create-service' : `/teams/${teamId}/create-service`}
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            disabled={isAdmin && !sessTeamId}
          >
            Create service
          </Button>
        )}
      </Box>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell align='right'>Public URL</TableCell>
              <TableCell align='right'>Cluster</TableCell>
              {showTeam && <TableCell align='right'>Team</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((row): any => (
              <TableRow key={row.serviceId}>
                <TableCell component='th' scope='row'>
                  {isAdmin || teamId ? getServiceLink(row) : row.name}
                </TableCell>
                <TableCell align='right'>{renderPublicUrl(row)}</TableCell>
                <TableCell align='right'>{row.clusterId}</TableCell>
                {showTeam && <TableCell align='right'>{row.teamId}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
