import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetAllWorkloadsApiResponse } from 'redux/otomiApi'
import { Status, getStatus } from 'utils/status'
import { useSocket } from 'providers/Socket'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  id: string
  name: string
  imageUpdateStrategy: { type: string }
}

const getWorkloadLink = (row: Row) => {
  const path = `/catalogs/${row.teamId}/${row.name}/${encodeURIComponent(row.name)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}
const getArgocdApplicationLink = (row: Row, domainSuffix: string) => {
  const app = `team-${row.teamId}-${row.name}`
  const path = `/applications/argocd/${app}`
  const host = `https://argocd.${domainSuffix}`
  const externalUrl = `${host}/${path}`

  return (
    <Link to={{ pathname: externalUrl }} target='_blank'>
      Application
    </Link>
  )
}

interface Props {
  workloads: GetAllWorkloadsApiResponse
  teamId?: string
}

export default function ({ workloads, teamId }: Props): React.ReactElement {
  const {
    oboTeamId,
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()
  const { t } = useTranslation()
  const { statuses } = useSocket()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getWorkloadLink(row),
    },
    {
      id: 'argocd',
      label: t('Argocd'),
      renderer: (row: Row) => getArgocdApplicationLink(row, domainSuffix),
    },
    {
      id: 'type',
      label: t('Image update strategy'),
      renderer: (row) => row?.imageUpdateStrategy?.type,
    },
    {
      id: 'Status',
      label: 'Status',
      renderer: (row: Row) => getStatus((statuses?.workloads?.[row.name] as Status) || 'NotFound'),
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
      headCells={headCells}
      rows={workloads}
      resourceType='Workload'
      to={`/catalogs/${teamId || oboTeamId}`}
    />
  )
}
