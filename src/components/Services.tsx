/* eslint-disable no-nested-ternary */
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetAllServicesApiResponse, GetTeamServicesApiResponse } from 'redux/otomiApi'
import useStatus from 'hooks/useStatus'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import MuiLink from './MuiLink'
import { getStatus } from './Workloads'

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

interface Props {
  services: GetAllServicesApiResponse | GetTeamServicesApiResponse
  teamId?: string
}

// TODO: https://github.com/redkubes/otomi-core/discussions/475
export default function ({ services, teamId }: Props): React.ReactElement {
  const {
    user: { isPlatformAdmin },
    oboTeamId,
  } = useSession()
  const { t } = useTranslation()
  const status = useStatus()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getServiceLink(isPlatformAdmin, oboTeamId),
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
      renderer: (row) => getStatus(status?.services?.[row.id]),
    },
  ]
  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }
  return <ListTable teamId={teamId} headCells={headCells} rows={services} resourceType='Service' />
}
