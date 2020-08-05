import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { isEmpty } from 'lodash/lang'
import React from 'react'
import { Link } from 'react-router-dom'
import { Team, Service } from '@redkubes/otomi-api-client-axios'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import MuiLink from './MuiLink'
import { useSession } from '../session-context'

const getServiceLink = (isAdmin, ownerId) => row => {
  const { teamId, id, name } = row
  if (!(isAdmin || teamId === ownerId)) return name

  const link = `/teams/${teamId}/services/${encodeURIComponent(id)}`
  return (
    <RLink to={link} label={name}>
      {name}
    </RLink>
  )
}

const renderPublicUrl = row => {
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
  services: Service[]
  team?: Team
  oboTeamId?: string
}

export default ({ services, team }: Props) => {
  const {
    user: { isAdmin },
    oboTeamId,
  } = useSession()
  const showTeam = !team
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Service Name',
      renderer: getServiceLink(isAdmin, oboTeamId),
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
    })

  return (
    <>
      <h1 data-cy='h1-services-page'>{!team ? 'Services' : `Services (team ${team.id})`}</h1>
      <Box mb={1}>
        {(isAdmin || team) && (
          <Button
            component={Link}
            to={isAdmin ? '/create-service' : `/teams/${team.id}/create-service`}
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            disabled={isAdmin && !oboTeamId}
            data-cy='button-create-service'
          >
            Create service
          </Button>
        )}
      </Box>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={services} idKey='id' />
    </>
  )
}
