/* eslint-disable no-nested-ternary */
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Box, Button } from '@mui/material'
import { useSession } from 'providers/Session'
import React from 'react'
import { Link } from 'react-router-dom'
import { GetAllServicesApiResponse, GetTeamApiResponse, GetTeamServicesApiResponse } from 'store/otomi'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import MuiLink from './MuiLink'

const getServiceLink = (isAdmin, ownerId): CallableFunction =>
  function (row): React.ReactElement {
    const { teamId, id, name } = row
    if (!(isAdmin || teamId === ownerId)) return name

    const path = `/teams/${teamId}/services/${encodeURIComponent(id)}`
    return (
      <RLink to={path} label={name}>
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
  services: GetAllServicesApiResponse | GetTeamServicesApiResponse
  teamId?: string
}

// TODO: https://github.com/redkubes/otomi-core/discussions/475
export default function ({ services, teamId }: Props): React.ReactElement {
  const {
    user: { isAdmin },
    oboTeamId,
  } = useSession()
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Service Name',
      renderer: getServiceLink(isAdmin, oboTeamId),
    },
    {
      id: 'ingressType',
      label: 'Ingress',
      renderer: (row) => row.ingress?.type ?? '',
    },
    {
      id: 'serviceType',
      label: 'Type',
      renderer: (row) => row.ksvc?.serviceType ?? '',
    },
    {
      id: 'host',
      label: 'Host Name',
      renderer: renderHost,
      component: MuiLink,
    },
  ]
  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: 'Team',
    })
  }
  return (
    <>
      <h1 data-cy='h1-services-page'>{!teamId ? 'Services' : `Services (team ${teamId})`}</h1>
      <Box mb={1}>
        {(isAdmin || oboTeamId) && (
          <Button
            component={Link}
            to={isAdmin && !oboTeamId ? '/create-service' : `/teams/${oboTeamId}/create-service`}
            startIcon={<AddCircleIcon />}
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
