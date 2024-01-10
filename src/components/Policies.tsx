import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamPoliciesApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  id: string
  name: string
  enabled: boolean
  profile: string
  severity: string
  actionOverride: string
}

const getPolicyLink = (row: Row) => {
  const path = `/teams/${row.teamId}/policies/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

interface Props {
  policies: GetTeamPoliciesApiResponse
  teamId?: string
}

export default function ({ policies, teamId }: Props): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getPolicyLink(row),
    },
    {
      id: 'profile',
      label: t('Profile'),
      renderer: (row) => row.profile,
    },
    {
      id: 'enabled',
      label: t('Enabled'),
      renderer: (row) => (row.enabled ? 'true' : 'false'),
    },
    {
      id: 'action',
      label: t('Action'),
      renderer: (row) => row.actionOverride,
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  return <ListTable teamId={teamId} headCells={headCells} rows={policies} resourceType='Policy' />
}
