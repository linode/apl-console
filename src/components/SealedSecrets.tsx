import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetSealedSecretsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import { getStatus } from './Workloads'

const getSecretLink = (isAdmin, ownerId) =>
  function (row) {
    const { teamId, id, name }: { teamId: string; id: string; name: string } = row
    if (!(isAdmin || teamId === ownerId)) return name

    const path =
      isAdmin && !ownerId
        ? `/sealed-secrets/${encodeURIComponent(id)}`
        : `/teams/${teamId}/sealed-secrets/${encodeURIComponent(id)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

interface Props {
  secrets: GetSealedSecretsApiResponse
  teamId?: string
}

export default function ({ secrets, teamId }: Props): React.ReactElement {
  const {
    oboTeamId,
    user: { isAdmin },
    status,
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getSecretLink(isAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: t('Type'),
      renderer: (row) => row?.type,
    },
    {
      id: 'Status',
      label: 'Status',
      renderer: (row) => getStatus(status?.sealedSecrets?.[row.id]),
    },
  ]
  if (!teamId) {
    headCells.splice(2, 0, {
      id: 'namespace',
      label: t('Team'),
      renderer: (row) => row.namespace || `team-${row.teamId}`,
    })
  }

  return <ListTable teamId={teamId} headCells={headCells} rows={secrets} resourceType='SealedSecret' />
}
