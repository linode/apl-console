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

interface Props {
  projects: GetTeamProjectsApiResponse
  teamId?: string
  canCreateResource: boolean
}

export default function ({ projects, teamId, canCreateResource }: Props): React.ReactElement {
  const { appsEnabled } = useSession()
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

  if (!appsEnabled.harbor)
    return <p>Admin needs to enable Harbor to activate this feature.</p>

  return (
    <ListTable
      teamId={teamId}
      canCreateResource={canCreateResource}
      headCells={headCells}
      rows={projects}
      resourceType='Project'
    />
  )
}
