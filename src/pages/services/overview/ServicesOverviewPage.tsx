import { skipToken } from '@reduxjs/toolkit/query/react'
import { HeadCell } from 'components/EnhancedTable'
import ListTable from 'components/ListTable'
import MuiLink from 'components/MuiLink'
import { Status, getStatus } from 'utils/status'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import { useSocket } from 'providers/Socket'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllServicesQuery, useGetTeamServicesQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'
import RLink from 'components/Link'

const getServiceLink = (isAdmin, ownerId): CallableFunction =>
  function (row): string | React.ReactElement {
    const { teamId, name }: { teamId: string; name: string } = row
    if (!(isAdmin || teamId === ownerId)) return name
    const path = `/teams/${teamId}/services/${encodeURIComponent(name)}`
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
  // TODO: Replace functionality in apl-core so that / is not needed on path or domain
  const url = `${subdomain ? `${subdomain}.` : ''}${domain}${paths?.[0] || ''}`
  return (
    <MuiLink href={`https://${url}`} target='_blank' rel='noopener'>
      {url}
    </MuiLink>
  )
}

interface Params {
  teamId?: string
}

export default function ServicesOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    user: { isPlatformAdmin },
    oboTeamId,
  } = useSession()
  const { statuses } = useSocket()
  const {
    data: allServices,
    isLoading: isLoadingAllServices,
    isFetching: isFetchingAllServices,
    refetch: refetchAllServices,
  } = useGetAllServicesQuery(teamId ? skipToken : undefined)
  const {
    data: teamServices,
    isLoading: isLoadingTeamServices,
    isFetching: isFetchingTeamServices,
    refetch: refetchTeamServices,
  } = useGetTeamServicesQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllServices) refetchAllServices()
    else if (teamId && !isFetchingTeamServices) refetchTeamServices()
  }, [isDirty])
  const { t } = useTranslation()
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
      renderer: (row) => getStatus((statuses?.services?.[row.name] as Status) || 'NotFound'),
    },
  ]
  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  const loading = isLoadingAllServices || isLoadingTeamServices
  const services = teamId ? teamServices : allServices
  const comp = services && <ListTable teamId={teamId} headCells={headCells} rows={services} resourceType='Service' />
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SERVICES', { scope: getRole(teamId) })} />
}
