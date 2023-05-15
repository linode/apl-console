import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetAllWorkloadsApiResponse, useGetAllWorkloadsQuery } from 'redux/otomiApi'
import { createCapabilities } from 'utils/permission'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  id: string
  name: string
}

const getWorkloadLink = (row: Row) => {
  const path = `/teams/${row.teamId}/workloads/${encodeURIComponent(row.id)}`
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

const getWorkloadValuesLink = (row: Row) => {
  const path = `/teams/${row.teamId}/workloads/${encodeURIComponent(row.id)}/values`
  return (
    <RLink to={path} label='values'>
      edit
    </RLink>
  )
}

interface Props {
  workloads: GetAllWorkloadsApiResponse
  teamId?: string
}

export default function ({ workloads, teamId }: Props): React.ReactElement {
  // const {
  //   oboTeamId,
  //   user: { isAdmin },
  // } = useSession()
  const {
    appsEnabled,
    license,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()
  const allWorkloads = useGetAllWorkloadsQuery().data
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Workload'),
      renderer: (row: Row) => getWorkloadLink(row),
    },
    {
      id: 'values',
      label: 'Workload values',
      renderer: (row: Row) => getWorkloadValuesLink(row),
    },
    {
      id: 'argocd',
      label: t('Argocd'),
      renderer: (row: Row) => getArgocdApplicationLink(row, domainSuffix),
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
      createDisabled={!createCapabilities(allWorkloads && allWorkloads.length, license.body.capabilities.workloads)}
      headCells={headCells}
      rows={workloads}
      resourceType='Workload'
    />
  )
}
