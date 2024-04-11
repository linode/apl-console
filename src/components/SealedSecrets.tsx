import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetSealedSecretsApiResponse } from 'redux/otomiApi'
import { Box } from '@mui/material'
import useStatus from 'hooks/useStatus'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import { getStatus } from './Workloads'
import MuiLink from './MuiLink'
import InformationBanner from './InformationBanner'

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
    appsEnabled,
    oboTeamId,
    user: { isAdmin },
  } = useSession()
  const { t } = useTranslation()
  const status = useStatus()
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

  return (
    <Box>
      {!appsEnabled['sealed-secrets'] ? (
        <p>Admin needs to enable the Sealed Secrets app to activate this feature.</p>
      ) : (
        <>
          <InformationBanner message='Please make sure to download encryption keys for the disaster recovery purpose.'>
            {isAdmin && (
              <MuiLink href='/api/v1/sealedsecretskeys' sx={{ ml: '8px' }}>
                Download Keys
              </MuiLink>
            )}
          </InformationBanner>
          <ListTable teamId={teamId} headCells={headCells} rows={secrets} resourceType='SealedSecret' />
        </>
      )}
    </Box>
  )
}
