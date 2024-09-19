import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamUsersApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  tag: string
  id: string
  name: string
  trigger: boolean
  mode: { type: string }
}

const getUserLink = (row: Row) => {
  const path = `/teams/${row.teamId}/users/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

interface Props {
  users: GetTeamUsersApiResponse
  teamId?: string
}

export default function ({ users, teamId }: Props): React.ReactElement {
  const { user } = useSession()

  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getUserLink(row),
    },
    {
      id: 'email',
      label: t('Email'),
      renderer: (row) => row.email,
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  return <ListTable teamId={teamId} headCells={headCells} rows={users} resourceType='User' />
}
