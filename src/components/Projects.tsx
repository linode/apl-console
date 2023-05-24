import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamProjectsApiResponse } from 'redux/otomiApi'
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

const getBuildLink = (row: Row) => {
  if (row?.build?.id) {
    const path = `/teams/${row.teamId}/builds/${encodeURIComponent(row.build.id)}`
    return (
      <RLink to={path} label={row.name}>
        {row.name}
      </RLink>
    )
  }
  return '-'
}
const getWorkloadLink = (row: Row) => {
  if (row?.workload?.id) {
    const path = `/teams/${row.teamId}/workloads/${encodeURIComponent(row.workload.id)}`
    return (
      <RLink to={path} label={row.name}>
        {row.name}
      </RLink>
    )
  }
  return '-'
}
const getServiceLink = (row: Row) => {
  if (row?.service?.id) {
    const path = `/teams/${row.teamId}/services/${encodeURIComponent(row.service.id)}`
    return (
      <RLink to={path} label={row.name}>
        {row.name}
      </RLink>
    )
  }
  return '-'
}

interface Props {
  projects: GetTeamProjectsApiResponse
  teamId?: string
}

export default function ({ projects, teamId }: Props): React.ReactElement {
  // const {
  //   oboTeamId,
  //   user: { isAdmin },
  // } = useSession()
  const {
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
      renderer: (row: Row) => getProjectLink(row),
    },
    {
      id: 'build',
      label: t('Build'),
      renderer: (row: Row) => getBuildLink(row),
    },
    {
      id: 'workload',
      label: t('Workload'),
      renderer: (row: Row) => getWorkloadLink(row),
    },
    {
      id: 'service',
      label: t('Service'),
      renderer: (row: Row) => getServiceLink(row),
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

  return <ListTable teamId={teamId} headCells={headCells} rows={projects} resourceType='Project' />
}
