import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamBackupsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

interface Row {
  teamId: string
  id: string
  name: string
  schedule: string
}

const getBackupNames = (row: Row) => {
  const path = `/teams/${row.teamId}/backups/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
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
      renderer: (row: Row) => getBackupNames(row),
    },
    {
      id: 'mode',
      label: t('Schedule'),
      renderer: (row) => row.schedule,
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  if (!appsEnabled.velero) return <p>Admin needs to enable the Velero app to activate this feature.</p>

  return <ListTable teamId={teamId} headCells={headCells} rows={backups} resourceType='Backup' />
}
