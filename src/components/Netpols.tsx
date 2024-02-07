import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamNetpolsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

const getNetpolLink = (isAdmin, ownerId) =>
  function (row) {
    const { teamId, id, name }: { teamId: string; id: string; name: string } = row
    if (!(isAdmin || teamId === ownerId)) return name

    const path =
      isAdmin && !ownerId ? `/netpols/${encodeURIComponent(id)}` : `/teams/${teamId}/netpols/${encodeURIComponent(id)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

interface Props {
  netpols: GetTeamNetpolsApiResponse
  teamId?: string
}

export default function ({ netpols, teamId }: Props): React.ReactElement {
  const {
    appsEnabled,
    oboTeamId,
    settings: { cluster },
    user: { isAdmin },
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getNetpolLink(isAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: t('ruleType'),
      renderer: (row) => row?.ruleType.type,
    },
  ]
  if (!teamId) {
    headCells.splice(2, 0, {
      id: 'namespace',
      label: t('Team'),
      renderer: (row) => row.namespace || `team-${row.teamId}`,
    })
  }

  return <ListTable teamId={teamId} headCells={headCells} rows={netpols} resourceType='Netpol' />
}
