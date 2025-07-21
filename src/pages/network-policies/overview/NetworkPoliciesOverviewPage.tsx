import { Box } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { HeadCell } from 'components/EnhancedTable'
import RLink from 'components/Link'
import ListTable from 'components/ListTable'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllNetpolsQuery, useGetTeamNetpolsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

// We should remove the linter rule that removes the braces around the function body
const getNetpolLink = (isAdmin, ownerId) =>
  function (row) {
    const { teamId, name }: { teamId: string; id: string; name: string } = row
    if (!(isAdmin || teamId === ownerId)) return name

    const path =
      isAdmin && !ownerId
        ? `/network-policies/${encodeURIComponent(name)}`
        : `/teams/${teamId}/network-policies/${encodeURIComponent(name)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

interface Params {
  teamId: string
}

export default function NetworkPoliciesOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    data: allNetpols,
    isLoading: isLoadingAllNetpols,
    isFetching: isFetchingAllNetpols,
    refetch: refetchAllNetpols,
  } = useGetAllNetpolsQuery(teamId ? skipToken : undefined)
  const {
    data: teamNetpols,
    isLoading: isLoadingTeamNetpols,
    isFetching: isFetchingTeamNetpols,
    refetch: refetchTeamNetpols,
  } = useGetTeamNetpolsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllNetpols) refetchAllNetpols()
    else if (teamId && !isFetchingTeamNetpols) refetchTeamNetpols()
  }, [isDirty])

  const {
    oboTeamId,
    user: { isPlatformAdmin },
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS

  const baseHeadCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getNetpolLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: t('ruleType'),
      renderer: (row) => row?.ruleType?.type,
    },
  ]

  // Include Team column if no specific teamId
  const teamCell: HeadCell = {
    id: 'namespace',
    label: t('Team'),
    renderer: (row) => row.namespace || `team-${row.teamId}`,
  }

  // Clone for ingress and egress
  const ingressHeadCells = [...baseHeadCells]
  const egressHeadCells = [...baseHeadCells]
  if (!teamId) {
    ingressHeadCells.splice(2, 0, teamCell)
    egressHeadCells.splice(2, 0, teamCell)
  }

  const netpols = teamId ? teamNetpols : allNetpols

  // Separate rows by rule type
  const ingressRows = netpols?.filter((row) => row.ruleType?.type === 'ingress')
  const egressRows = netpols?.filter((row) => row.ruleType?.type === 'egress')

  const loading = isLoadingAllNetpols || isLoadingTeamNetpols
  const comp = (
    <Box>
      <ListTable
        teamId={teamId}
        headCells={ingressHeadCells}
        rows={ingressRows}
        resourceType='Inbound Rule'
        to={`/teams/${teamId}/network-policies/inbound-rules/create`}
      />
      <ListTable
        teamId={teamId}
        headCells={egressHeadCells}
        rows={egressRows}
        resourceType='Outbound Rule'
        to={`/teams/${teamId}/network-policies/outbound-rules/create`}
      />
    </Box>
  )
  return <PaperLayout loading={loading} comp={comp} title={t('Network Policies', { role: getRole(teamId) })} />
}
