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
import { useGetAllAplNetpolsQuery, useGetTeamAplNetpolsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId: string
}

interface NetworkPolicyType {
  type?: 'ingress' | 'egress'
}

interface NetpolRow {
  metadata?: {
    name?: string
    labels?: {
      'apl.io/teamId'?: string
    }
  }
  spec?: {
    ruleType?: NetworkPolicyType & {
      ingress?: {
        toLabelValue?: string
        allow?: {
          fromLabelValue?: string
        }[]
      }
      egress?: {
        domain?: string
        ports?: {
          number: number
          protocol: 'HTTPS' | 'HTTP' | 'TCP'
        }[]
      }
    }
  }
}

const truncate = (str?: string, max = 50) => {
  if (!str) return ''
  return str.length > max ? `${str.slice(0, max)}…` : str
}

const getNetpolLink = (isAdmin: boolean, ownerId?: string) => {
  return function (row: NetpolRow) {
    const name = row.metadata?.name ?? ''
    const rowTeamId = row.metadata?.labels?.['apl.io/teamId']
    const ruleType = row.spec?.ruleType

    if (!(isAdmin || rowTeamId === ownerId)) return name

    const type = ruleType?.type === 'ingress' ? 'inbound-rules' : 'outbound-rules'
    const path =
      isAdmin && !ownerId
        ? `/network-policies/${type}/${encodeURIComponent(name)}`
        : `/teams/${rowTeamId}/network-policies/${type}/${encodeURIComponent(name)}`

    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }
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
  } = useGetAllAplNetpolsQuery(teamId ? skipToken : undefined)

  const {
    data: teamNetpols,
    isLoading: isLoadingTeamNetpols,
    isFetching: isFetchingTeamNetpols,
    refetch: refetchTeamNetpols,
  } = useGetTeamAplNetpolsQuery({ teamId }, { skip: !teamId })

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

  const ingressHeadCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getNetpolLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'source',
      label: t('Source'),
      renderer: (row: NetpolRow) => {
        const names = row.spec?.ruleType?.ingress?.allow
          ?.map((a) => a.fromLabelValue)
          .filter(Boolean)
          .join(', ')
        return truncate(names)
      },
    },
    {
      id: 'target',
      label: t('Target'),
      renderer: (row: NetpolRow) => truncate(row.spec?.ruleType?.ingress?.toLabelValue),
    },
  ]

  const egressHeadCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getNetpolLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'domain',
      label: t('Domain'),
      renderer: (row: NetpolRow) => row.spec?.ruleType?.egress?.domain || '',
    },
    {
      id: 'port',
      label: t('Port'),
      renderer: (row: NetpolRow) => row.spec?.ruleType?.egress?.ports?.map((p) => p.number).join(', ') || '',
    },
    {
      id: 'protocol',
      label: t('Protocol'),
      renderer: (row: NetpolRow) => row.spec?.ruleType?.egress?.ports?.map((p) => p.protocol).join(', ') || '',
    },
  ]

  const ingressRows = netpols?.filter((row) => row.spec?.ruleType?.type === 'ingress')
  const egressRows = netpols?.filter((row) => row.spec?.ruleType?.type === 'egress')

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
