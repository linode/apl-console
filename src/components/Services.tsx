import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { Team, Service } from '@redkubes/otomi-api-client-axios'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import MuiLink from './MuiLink'
import { useSession } from '../session-context'

const getServiceLink = (isAdmin, ownerId): CallableFunction => (row): React.ReactElement => {
  const { teamId, id, name } = row
  if (!(isAdmin || teamId === ownerId)) return name

  const link = `/teams/${teamId}/services/${encodeURIComponent(id)}`
  return (
    <RLink to={link} label={name}>
      {name}
    </RLink>
  )
}

const renderPublicUrl = (row): React.ReactElement | string => {
  if (!row?.ingress?.public) {
    return ''
  }
  const ingressPublic = row.ingress.public
  const url = `${ingressPublic.subdomain ? `${ingressPublic.subdomain}.` : ''}${ingressPublic.domain}${
    ingressPublic.path || ''
  }`
  return (
    <MuiLink href={`https://${url}`} target='_blank' rel='noopener'>
      {url}
    </MuiLink>
  )
}

interface Props {
  services: Service[]
  team?: Team
}

export default ({ services, team }: Props): React.ReactElement => {
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
        {(isAdmin || oboTeamId) && (
          <Button
            component={Link}
            to={isAdmin && !oboTeamId ? '/create-service' : `/teams/${oboTeamId}/create-service`}
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
