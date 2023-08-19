import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamSourcesApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  id: string
  name: string
  sourceType: string
}

const getSourceNames = (row: Row) => {
  const path = `/teams/${row.teamId}/sources/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

interface Props {
  sources: GetTeamSourcesApiResponse
  teamId?: string
}

export default function ({ sources, teamId }: Props): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getSourceNames(row),
    },
    {
      id: 'sourceType',
      label: t('Type'),
      renderer: (row) => row.sourceType.type,
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  return <ListTable teamId={teamId} headCells={headCells} rows={sources} resourceType='Source' />
}
