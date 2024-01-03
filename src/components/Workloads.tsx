import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetAllWorkloadsApiResponse } from 'redux/otomiApi'
import { CircularProgress } from '@mui/material'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import Iconify from './Iconify'

interface Row {
  teamId: string
  id: string
  name: string
  imageUpdateStrategy: { type: string }
}

const getWorkloadLink = (row: Row) => {
  const path = `/catalogs/${row.teamId}/${row.name}/${encodeURIComponent(row.id)}`
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

type Status = 'Unknown' | 'Pending' | 'Succeeded' | 'NotFound'

export const getStatus = (status: Status) => {
  if (!status || status === 'NotFound') return <CircularProgress size='22px' />
  switch (status) {
    case 'Unknown':
      return <Iconify color='#FF4842' icon='eva:alert-circle-fill' width={22} height={22} />
    case 'Pending':
      return <Iconify color='#FFC107' icon='eva:alert-triangle-fill' width={22} height={22} />
    case 'Succeeded':
      return <Iconify color='#54D62C' icon='eva:checkmark-circle-2-fill' width={22} height={22} />
    default:
      return <CircularProgress size='22px' />
  }
}

interface Props {
  workloads: GetAllWorkloadsApiResponse
  teamId?: string
  canCreateResource: boolean
}

export default function ({ workloads, teamId, canCreateResource }: Props): React.ReactElement {
  const {
    oboTeamId,
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
    status,
  } = useSession()
  const { t } = useTranslation()
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
      renderer: (row: Row) => getStatus(status?.workloads?.[row.id]),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  if (!appsEnabled.argocd) return <p>Admin needs to enable the ArgoCD app to activate this feature.</p>

  return (
    <ListTable
      teamId={teamId}
      canCreateResource={canCreateResource}
      headCells={headCells}
      rows={workloads}
      resourceType='Workload'
      to={`/catalogs/${teamId || oboTeamId}`}
    />
  )
}
