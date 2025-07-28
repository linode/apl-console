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

interface Params {
  teamId: string
}

interface NetworkPolicyType {
  type?: 'ingress' | 'egress'
}

// Helper to truncate long strings
const truncate = (str?: string, max = 50) => {
  if (!str) return ''
  return str.length > max ? `${str.slice(0, max)}…` : str
}

const getNetpolLink = (isAdmin: boolean, ownerId?: string) =>
  function (row) {
    const { teamId, name, ruleType }: { teamId: string; name: string; ruleType: NetworkPolicyType } = row
    if (!(isAdmin || teamId === ownerId)) return name

    const type = ruleType.type === 'ingress' ? 'inbound-rules' : 'outbound-rules'
    const path =
      isAdmin && !ownerId
        ? `/network-policies/${type}/${encodeURIComponent(name)}`
        : `/teams/${teamId}/network-policies/${type}/${encodeURIComponent(name)}`

    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
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

  const netpols = teamId ? teamNetpols : allNetpols

  // Define columns for ingress (Inbound Rule)
  const ingressHeadCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getNetpolLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'source',
      label: t('Source'),
      renderer: (row) => truncate(row.ruleType?.ingress?.toLabelValue),
    },
    {
      id: 'target',
      label: t('Target'),
      renderer: (row) => {
        const names = row.ruleType?.ingress?.allow
          ?.map((a) => a.fromLabelValue)
          .filter(Boolean)
          .join(', ')
        return truncate(names)
      },
    },
  ]

  // Define columns for egress (Outbound Rule)
  const egressHeadCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getNetpolLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'domain',
      label: t('Domain'),
      renderer: (row) => row.ruleType?.egress?.domain || '',
    },
    {
      id: 'port',
      label: t('Port'),
      renderer: (row) => row.ruleType?.egress?.ports?.map((p) => p.number).join(', ') || '',
    },
    {
      id: 'protocol',
      label: t('Protocol'),
      renderer: (row) => row.ruleType?.egress?.ports?.map((p) => p.protocol).join(', ') || '',
    },
  ]

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

  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_NETWORK_POLICIES', { role: getRole(teamId) })} />
}
