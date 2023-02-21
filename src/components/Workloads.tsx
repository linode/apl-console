import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamWorkloadsApiResponse } from 'redux/otomiApi'
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
const getWorkloadValuesLink = (row: Row) => {
  const path = `/teams/${row.teamId}/workloads/${encodeURIComponent(row.id)}/values`
  return (
    <RLink to={path} label='values'>
      values
    </RLink>
  )
}

interface Props {
  workloads: GetTeamWorkloadsApiResponse
  teamId?: string
}

export default function ({ workloads, teamId }: Props): React.ReactElement {
  // const {
  //   oboTeamId,
  //   user: { isAdmin },
  // } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getWorkloadLink(row),
    },
    {
      id: 'values',
      label: 'Values',
      renderer: (row: Row) => getWorkloadValuesLink(row),
    },
  ]

  return <ListTable teamId={teamId} headCells={headCells} rows={workloads} resourceType='Workload' />
}
