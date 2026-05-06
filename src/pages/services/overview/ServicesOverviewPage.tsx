import { skipToken } from '@reduxjs/toolkit/query/react'
import { HeadCell } from 'components/EnhancedTable'
import ListTable from 'components/ListTable'
import MuiLink from 'components/MuiLink'
import { getStatus } from 'components/Workloads'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import { useSocket } from 'providers/Socket'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAplServiceQuery, useGetTeamAplServicesQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'
import RLink from 'components/Link'

const getServiceLink = (isAdmin, ownerId): CallableFunction =>
  function (row): string | React.ReactElement {
    const teamId = row.metadata.labels['apl.io/teamId']
    const name = row.metadata.name

    if (!(isAdmin || teamId === ownerId)) return name

    const path = `/teams/${teamId}/services/${encodeURIComponent(name)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

const renderHost = (row): React.ReactElement | string => {
  const name = row.metadata.name
  const teamId = row.metadata.labels['apl.io/teamId']
  const { ownHost, domain, paths } = row.spec || {}

  if (!ownHost) return `${name}.team-${teamId}`
  if (!domain) return ''

  const url = `${domain}${paths?.[0] || ''}`

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
  } = useGetAplServiceQuery(teamId ? skipToken : undefined)

  const {
    data: teamServices,
    isLoading: isLoadingTeamServices,
    isFetching: isFetchingTeamServices,
    refetch: refetchTeamServices,
  } = useGetTeamAplServicesQuery(teamId ? { teamId } : skipToken)

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllServices) refetchAllServices()
    else if (teamId && !isFetchingTeamServices) refetchTeamServices()
  }, [isDirty])

  const { t } = useTranslation()

  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getServiceLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'ingressClass',
      label: t('Ingress class'),
      renderer: (row) => (row.spec?.ownHost ? row.spec?.ingressClassName ?? 'platform' : '-'),
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
      renderer: (row) => getStatus(statuses?.services?.[row.metadata.name]),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
      renderer: (row) => row.metadata.labels['apl.io/teamId'],
    })
  }

  const loading = isLoadingAllServices || isLoadingTeamServices
  const services = teamId ? teamServices : allServices
  const comp = (
    <ListTable
      teamId={teamId}
      headCells={headCells}
      rows={Array.isArray(services) ? services : []}
      resourceType='Service'
    />
  )

  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SERVICES', { scope: getRole(teamId) })} />
}
