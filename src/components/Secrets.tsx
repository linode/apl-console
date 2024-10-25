import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetSecretsApiResponse } from 'redux/otomiApi'
import { Box } from '@mui/material'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import MuiLink from './MuiLink'
import InformationBanner from './InformationBanner'

const getSecretLink = (isAdmin, ownerId) =>
  function (row) {
    const { teamId, id, name }: { teamId: string; id: string; name: string } = row
    if (!(isAdmin || teamId === ownerId)) return name

    const path =
      isAdmin && !ownerId ? `/secrets/${encodeURIComponent(id)}` : `/teams/${teamId}/secrets/${encodeURIComponent(id)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

const getVaultSecretLink = (clusterDomain) =>
  function (row) {
    const { teamId, name } = row
    const url = `https://vault.${clusterDomain}/ui/vault/secrets/secret/show/teams/team-${teamId}/${name}`
    return (
      <MuiLink href={`${url}`} target='_blank' rel='noopener'>
        vault:{name}
      </MuiLink>
    )
  }

interface Props {
  secrets: GetSecretsApiResponse
  teamId?: string
}

export default function ({ secrets, teamId }: Props): React.ReactElement {
  const {
    appsEnabled,
    oboTeamId,
    settings: { cluster },
    user: { isPlatformAdmin },
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getSecretLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: t('Type'),
      renderer: (row) => row.secret.type,
    },
    {
      id: 'vaultLink',
      label: 'Vault',
      renderer: getVaultSecretLink(cluster.domainSuffix),
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
      <InformationBanner message='Secrets with Hashicorp Vault are going to be removed in Otomi v3.0.0. Otomi provides Sealed Secrets as a replacement.' />
      {!appsEnabled.vault ? (
        <InformationBanner message=' Admin needs to enable the Vault app to activate this feature.' />
      ) : (
        <ListTable teamId={teamId} headCells={headCells} rows={secrets} resourceType='Secret' />
      )}
    </Box>
  )
}
