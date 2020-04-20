import { Box, Button, Link as MuiLink } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { isEmpty } from 'lodash/lang'
import { Link } from 'react-router-dom'
import RLink from './Link'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from './Table'
import { Team } from '../models'

const getServiceLink = (row): any => {
  const { serviceId, teamId, name } = row
  const link = `/teams/${teamId}/services/${encodeURIComponent(serviceId)}`
  return <RLink to={link}>{name}</RLink>
}

const renderPublicUrl = (row): any => {
  if (isEmpty(row.ingress)) {
    return '-'
  }
  const url = `${row.ingress.subdomain ? `${row.ingress.subdomain}.` : ''}${row.ingress.domain}`
  return (
    <MuiLink href={`https://${url}`} target='_blank' rel='noopener'>
      {url}
    </MuiLink>
  )
}

interface Props {
  services: any[]
  team?: Team
  sessTeamId?: string
  isAdmin: boolean
}

export default ({ services, team, sessTeamId, isAdmin }: Props): any => {
  const showTeam = !team

  return (
    <div className='Services'>
      <h1>Services{team ? `: Team ${team.name}` : ''}</h1>
      <Box mb={1}>
        {(isAdmin || team) && (
          <Button
            component={Link}
            to={isAdmin ? '/create-service' : `/teams/${team.teamId}/create-service`}
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
                  {isAdmin || team ? getServiceLink(row) : row.name}
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
