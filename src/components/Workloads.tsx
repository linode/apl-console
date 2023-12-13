import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetAllWorkloadsApiResponse } from 'redux/otomiApi'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  id: string
  name: string
}

const getWorkloadLink = (row: Row) => {
  const path = `/catalogs/${row.teamId}/${row.name}/${encodeURIComponent(row.id)}`
  return (
    <>
      <RLink to={path} label={row.name}>
        {row.name}
      </RLink>
      {/* {name === row.name && <span>{status}</span>} */}
    </>
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

const getStatus = (row: Row, statuses: any) => {
  const status = statuses?.[row.name]
  return status ? status.status : 'Unknown'
}

interface Props {
  workloads: GetAllWorkloadsApiResponse
  teamId?: string
  canCreateResource: boolean
}

export default function ({ workloads, teamId, canCreateResource }: Props): React.ReactElement {
  const url = `${window.location.origin.replace(/^http/, 'ws')}`
  const path = '/api/ws'
  const { socket, error: errorSocket } = useSocket({ url, path })
  const { lastMessage } = useSocketEvent<any>(socket, 'workloads')
  console.log('lastMessage:', lastMessage)
  // const {
  //   oboTeamId,
  //   user: { isAdmin },
  // } = useSession()
  const {
    oboTeamId,
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
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
      id: 'Status',
      label: 'Status',
      renderer: (row: Row) => getStatus(row, lastMessage),
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
