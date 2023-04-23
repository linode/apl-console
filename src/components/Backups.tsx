import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetTeamBackupsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  id: string
  name: string
}

const getBackupLink = (row: Row) => {
  const path = `/teams/${row.teamId}/backups/${encodeURIComponent(row.id)}`
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

const getBackupValuesLink = (row: Row) => {
  const path = `/teams/${row.teamId}/backups/${encodeURIComponent(row.id)}/values`
  return (
    <RLink to={path} label='values'>
      edit
    </RLink>
  )
}

interface Props {
  backups: GetTeamBackupsApiResponse
  teamId?: string
}

export default function ({ backups, teamId }: Props): React.ReactElement {
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
      label: t('Backup'),
      renderer: (row: Row) => getBackupLink(row),
    },
    {
      id: 'values',
      label: 'Backup values',
      renderer: (row: Row) => getBackupValuesLink(row),
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

  return <ListTable teamId={teamId} headCells={headCells} rows={backups} resourceType='Backup' />
}
