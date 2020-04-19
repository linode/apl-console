import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { isEmpty } from 'lodash/lang'
import { Link } from 'react-router-dom'
import { RLink, Link as MuiLink } from './Link'
import EnhancedTable from './EnhancedTable'
import { Team } from '../models'

const getServiceLink = isAdmin => (row): any => {
  if (!isAdmin) return row.name
  const { serviceId, teamId, name } = row
  const link = `/teams/${teamId}/services/${encodeURIComponent(serviceId)}`
  return <RLink to={link}>{name}</RLink>
}

const renderPublicUrl = (row): any => {
  if (isEmpty(row.ingress)) {
    return ''
  }
  const url = `${row.ingress.subdomain ? `${row.ingress.subdomain}.` : ''}${row.ingress.domain}`
  return (
    <MuiLink href={`https://${url}`} target='_blank' rel='noopener'>
      {url}
    </MuiLink>
  )
}

interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  numeric: boolean
  renderer?: CallableFunction
}

interface Props {
  services: any[]
  team?: Team
  sessTeamId?: string
  isAdmin: boolean
}

export default ({ services, team, sessTeamId, isAdmin }: Props): any => {
  const showTeam = !team
  const headCells: HeadCell[] = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Service Name', renderer: getServiceLink(isAdmin) },
    { id: 'url', numeric: false, disablePadding: false, label: 'Public URL', renderer: renderPublicUrl },
    { id: 'clusterId', numeric: false, disablePadding: false, label: 'Cluster' },
  ]
  if (showTeam)
    headCells.push({
      id: 'teamId',
      numeric: false,
      disablePadding: false,
      label: 'Team',
      renderer: row => row.teamId.charAt(0).toUpperCase() + row.teamId.substr(1),
    })

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
      <EnhancedTable headCells={headCells} orderByStart='name' rows={services} />
    </div>
  )
}
