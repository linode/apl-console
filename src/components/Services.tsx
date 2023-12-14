/* eslint-disable no-nested-ternary */
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { GetAllServicesApiResponse, GetTeamServicesApiResponse, useStatusMutation } from 'redux/otomiApi'
import { CircularProgress } from '@mui/material'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import MuiLink from './MuiLink'
import Iconify from './Iconify'

const getServiceLink = (isAdmin, ownerId): CallableFunction =>
  function (row): string | React.ReactElement {
    const { teamId, id, name }: { teamId: string; id: string; name: string } = row
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
  const { subdomain, domain, paths } = ingress
  const url = `${subdomain ? `${subdomain}.` : ''}${domain}${paths?.[0] || ''}`
  return (
    <MuiLink href={`https://${url}`} target='_blank' rel='noopener'>
      {url}
    </MuiLink>
  )
}

const getStatus = (row: any, statuses: any) => {
  const status = statuses?.[row.name]
  if (!status || status.status === 'NotFound') return <CircularProgress size='22px' />

  switch (status.status) {
    case 'Failed':
      return <Iconify color='#FF4842' icon='eva:alert-circle-fill' width={22} height={22} />
    // case 'OutOfSync':
    //   return <Iconify color='#FFC107' icon='eva:alert-triangle-fill' width={22} height={22} />
    case 'Ready':
      return <Iconify color='#54D62C' icon='eva:checkmark-circle-2-fill' width={22} height={22} />
    default:
      return <CircularProgress size='22px' />
  }
}

interface Props {
  services: GetAllServicesApiResponse | GetTeamServicesApiResponse
  teamId?: string
  canCreateResource: boolean
}

// TODO: https://github.com/redkubes/otomi-core/discussions/475
export default function ({ services, teamId, canCreateResource }: Props): React.ReactElement {
  const url = `${window.location.origin.replace(/^http/, 'ws')}`
  const path = '/api/ws'
  const { socket } = useSocket({ url, path })
  const { lastMessage } = useSocketEvent<any>(socket, 'services')
  console.log('services:', lastMessage)
  const [startStopStatus] = useStatusMutation()

  useEffect(() => {
    let intervalId: number
    startStopStatus({ body: { resource: 'builds', operation: 'start' } }).then((res: any) => {
      intervalId = res.data
    })
    return () => {
      startStopStatus({ body: { resource: 'builds', operation: 'stop', intervalId } })
    }
  }, [])
  const {
    user: { isAdmin },
    oboTeamId,
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getServiceLink(isAdmin, oboTeamId),
    },
    {
      id: 'ingressClass',
      label: t('Ingress class'),
      renderer: (row) => (row.ingress?.type === 'cluster' ? '-' : row.ingress?.ingressClassName ?? 'platform'),
    },
    {
      id: 'url',
      label: t('URL'),
      renderer: renderHost,
      component: MuiLink,
    },
    {
      id: 'Status',
      label: 'Status',
      renderer: (row) => getStatus(row, lastMessage),
    },
  ]
  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }
  return (
    <ListTable
      teamId={teamId}
      canCreateResource={canCreateResource}
      headCells={headCells}
      rows={services}
      resourceType='Service'
    />
  )
}
