/* eslint-disable no-nested-ternary */
import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { Team, Service } from '@redkubes/otomi-api-client-axios'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import MuiLink from './MuiLink'
import { useSession } from '../session-context'

const getServiceLink = (isAdmin, ownerId, isCE): CallableFunction => (row): React.ReactElement => {
  const { teamId, id, name } = row
  if (isCE || !(isAdmin || teamId === ownerId)) return name

  const link = `/teams/${teamId}/services/${encodeURIComponent(id)}`
  return (
    <RLink to={link} label={name}>
      {name}
    </RLink>
  )
}

const renderHost = ({ ingress, teamId, name }): React.ReactElement | string => {
  if (!ingress) return ''
  if (ingress.type === 'cluster') return `${name}.team-${teamId}`
  const { subdomain, domain, path } = ingress
  const url = `${subdomain ? `${subdomain}.` : ''}${domain}${path || ''}`
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

// TODO: https://github.com/redkubes/otomi-core/discussions/475
export default ({ services, team }: Props): React.ReactElement => {
  const {
    mode,
    user: { isAdmin },
    oboTeamId,
  } = useSession()
  const isCE = mode === 'ce'
  const showTeam = isCE ? false : !team
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Service Name',
      renderer: getServiceLink(isAdmin, oboTeamId, isCE),
    },
    {
      id: 'ingressType',
      label: 'Ingress',
      renderer: (row) => (isCE ? row.type : row.ingress?.type ?? ''),
    },
    {
      id: 'serviceType',
      label: 'Type',
      renderer: (row) => (isCE ? ('ksvc' in row ? 'ksvc' : 'regular') : row.ksvc?.serviceType ?? ''),
    },
    {
      id: 'host',
      label: 'Host',
      renderer: renderHost,
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
            disabled={isCE || (isAdmin && !oboTeamId)}
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
