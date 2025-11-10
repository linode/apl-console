import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import MuiLink from 'components/MuiLink'
import { HeadCell } from 'components/EnhancedTable'
import RLink from 'components/Link'
import ListTable from 'components/ListTable'
import { Status, getStatus } from 'utils/status'
import InformationBanner from 'components/InformationBanner'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { RouteComponentProps } from 'react-router-dom'
import { useGetAllSealedSecretsQuery, useGetTeamSealedSecretsQuery } from 'redux/otomiApi'
import { useAppSelector } from 'redux/hooks'
import { useSocket } from 'providers/Socket'

const getSecretLink = (isAdmin, ownerId) =>
  function (row) {
    const { teamId, name }: { teamId: string; name: string } = row
    if (!(isAdmin || teamId === ownerId)) return name

    const path =
      isAdmin && !ownerId
        ? `/secrets/${encodeURIComponent(name)}`
        : `/teams/${teamId}/secrets/${encodeURIComponent(name)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

interface Params {
  teamId: string
}

export default function SecretOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    data: allSealedSecrets,
    isLoading: isLoadingAllSealedSecrets,
    isFetching: isFetchingAllSealedSecrets,
    refetch: refetchAllSealedSecrets,
  } = useGetAllSealedSecretsQuery(teamId ? skipToken : undefined)
  const {
    data: teamSealedSecrets,
    isLoading: isLoadingTeamSealedSecrets,
    isFetching: isFetchingTeamSealedSecrets,
    refetch: refetchTeamSealedSecrets,
  } = useGetTeamSealedSecretsQuery({ teamId }, { skip: !teamId })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllSealedSecrets) refetchAllSealedSecrets()
    else if (teamId && !isFetchingTeamSealedSecrets) refetchTeamSealedSecrets()
  }, [isDirty])

  const {
    oboTeamId,
    user: { isPlatformAdmin },
  } = useSession()
  const { t } = useTranslation()
  const { statuses } = useSocket()
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
      renderer: (row) => row?.type || row?.template?.type,
    },
    {
      id: 'Status',
      label: 'Status',
      renderer: (row) => getStatus((statuses?.secrets?.[row.name] as Status) || 'NotFound'),
    },
  ]
  if (!teamId) {
    headCells.splice(2, 0, {
      id: 'namespace',
      label: t('Team'),
      renderer: (row) => row.namespace || `team-${row.teamId}`,
    })
  }
  const loading = isLoadingAllSealedSecrets || isLoadingTeamSealedSecrets
  const sealedSecrets = teamId ? teamSealedSecrets : allSealedSecrets
  const comp = (
    <Box>
      {isPlatformAdmin && (
        <InformationBanner message='Please make sure to download encryption keys for the disaster recovery purpose.'>
          <MuiLink href='/api/v1/sealedsecretskeys' sx={{ ml: '8px' }}>
            Download Keys
          </MuiLink>
        </InformationBanner>
      )}
      <ListTable teamId={teamId} headCells={headCells} rows={sealedSecrets} resourceType='Secret' />
    </Box>
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_TEAMS')} />
}
