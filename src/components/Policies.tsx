import { useSession } from 'providers/Session'
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
  action: string
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
  const { appsEnabled } = useSession()

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
      renderer: (row) => row.action,
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }
  if (!appsEnabled.kyverno) return <p>Admin needs to enable the Kyverno app to activate this feature.</p>

  return <ListTable teamId={teamId} headCells={headCells} rows={policies} resourceType='Policy' />
}
