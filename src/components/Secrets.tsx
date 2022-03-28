import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Box, Button } from '@mui/material'
import { useSession } from 'providers/Session'
import React from 'react'
import { Link } from 'react-router-dom'
import { GetSecretsApiResponse } from 'redux/otomiApi'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import MuiLink from './MuiLink'

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
    const url = `https://vault.${clusterDomain}/ui/vault/secrets/secret/show/teams/team-${teamId}/$`
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
    user: { isAdmin },
  } = useSession()
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Name',
      renderer: getSecretLink(isAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: 'Type',
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
      label: 'namespace',
      renderer: (row) => row.namespace || `team-${row.teamId}`,
    })
  }
  return (
    <>
      <h1 data-cy='h1-secrets-page'>{`Secrets (team ${teamId})`}</h1>
      <Box mb={1}>
        {(isAdmin || oboTeamId) && (
          <Button
            component={Link}
            to={isAdmin && !oboTeamId ? '/create-secret' : `/teams/${oboTeamId}/create-secret`}
            startIcon={<AddCircleIcon />}
            disabled={(!isAdmin && !oboTeamId) || !appsEnabled.vault}
            data-cy='button-create-secret'
          >
            Create secret
          </Button>
        )}
      </Box>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={secrets} idKey='id' />
    </>
  )
}
