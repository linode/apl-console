import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamProjectsApiResponse, useGetAllServicesQuery, useGetAllWorkloadsQuery } from 'redux/otomiApi'
import { createCapabilities } from 'utils/permission'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  id: string
  name: string
  mode: { type: string }
  build?: { id: string }
  workload?: { id: string }
  service?: { id: string }
}

const getProjectLink = (row: Row) => {
  const path = `/teams/${row.teamId}/projects/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

interface Props {
  projects: GetTeamProjectsApiResponse
  teamId?: string
}

export default function ({ projects, teamId }: Props): React.ReactElement {
  const { appsEnabled, license } = useSession()
  const allWorkloads = useGetAllWorkloadsQuery().data
  const allServices = useGetAllServicesQuery().data
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getProjectLink(row),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  if (!appsEnabled.tekton || !appsEnabled.harbor)
    return <p>Admin needs to enable the Tekton and Harbor apps to activate this feature.</p>

  const isDisabled = (): { collection: string; value: boolean } => {
    const workload = !createCapabilities(allWorkloads && allWorkloads.length, license.body.capabilities.workloads)
    const service = !createCapabilities(allServices && allServices.length, license.body.capabilities.services)
    if (!allWorkloads || !allServices) return { collection: '', value: false }
    return { collection: workload ? 'workload' : 'service', value: workload || service }
  }

  return (
    <ListTable
      teamId={teamId}
      createDisabled={isDisabled().value}
      headCells={headCells}
      rows={projects}
      resourceType='Project'
      collection={isDisabled().collection}
    />
  )
}
