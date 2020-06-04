import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { isEmpty } from 'lodash/lang'
import React from 'react'
import { Link } from 'react-router-dom'
import { Team } from '../models'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import MuiLink from './MuiLink'
import { useSession } from '../session-context'

const getServiceLink = (isAdmin, ownerId) => (row): any => {
  if (!(isAdmin || row.teamId === ownerId)) return row.name
  const { id, teamId, name } = row
  const link = `/teams/${teamId}/services/${encodeURIComponent(id)}`
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
}

export default ({ services, team }: Props): any => {
  const {
    user: { teamId, isAdmin },
    oboTeamId,
  } = useSession()
  const showTeam = !team
  const sessTeamId = isAdmin ? oboTeamId : teamId
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
      <h1>{!team ? 'All Services' : `Team Services${isAdmin && oboTeamId ? ` (team ${oboTeamId})` : ''}`}</h1>
      <Box mb={1}>
        {(isAdmin || team) && (
          <Button
            component={Link}
            to={isAdmin ? '/create-service' : `/teams/${team.id}/create-service`}
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
