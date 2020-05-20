import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { isEmpty } from 'lodash/lang'
import React from 'react'
import { Link } from 'react-router-dom'
import { Team } from '../models'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import MuiLink from './MuiLink'

const getServiceLink = (isAdmin, ownerId) => (row): any => {
  if (!(isAdmin || row.teamId === ownerId)) return row.name
  const { serviceId, teamId, name } = row
  const link = `/teams/${teamId}/services/${encodeURIComponent(serviceId)}`
  return <RLink to={link}>{name}</RLink>
}

const renderPublicUrl = (row): any => {
  if (isEmpty(row.ingress)) {
    return ''
  }
  const url = `${row.ingress.subdomain ? `${row.ingress.subdomain}.` : ''}${row.ingress.domain}${row.ingress.path ||
    ''}`
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
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Service Name',
      renderer: getServiceLink(isAdmin, sessTeamId),
    },
    {
      id: 'url',
      label: 'Public URL',
      renderer: renderPublicUrl,
      component: MuiLink,
    },
    { id: 'clusterId', numeric: false, disablePadding: false, label: 'Cluster' },
  ]
  if (showTeam)
    headCells.push({
      id: 'teamId',
      label: 'Team',
      renderer: row => row.teamId.charAt(0).toUpperCase() + row.teamId.substr(1),
    })

  return (
    <>
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
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={services} idKey='serviceId' />
    </>
  )
}
