import { skipToken } from '@reduxjs/toolkit/query/react'
import { CircularProgress } from '@mui/material'
import { HeadCell } from 'components/EnhancedTable'
import Iconify from 'components/Iconify'
import RLink from 'components/Link'
import ListTable from 'components/ListTable'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import { useSocket } from 'providers/Socket'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllAplWorkloadsQuery, useGetTeamAplWorkloadsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

interface Row {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
  spec: {
    imageUpdateStrategy?: {
      type?: string
    }
  }
}

const getWorkloadLink = (row: Row) => {
  const teamId = row.metadata?.labels?.['apl.io/teamId']
  const name = row.metadata?.name ?? ''

  const path = `/teams/${teamId}/catalogs/${name}/${encodeURIComponent(name)}`

  return (
    <RLink to={path} label={name}>
      {name}
    </RLink>
  )
}

const getArgocdApplicationLink = (row: Row, domainSuffix: string) => {
  const teamId = row.metadata?.labels?.['apl.io/teamId']
  const name = row.metadata?.name ?? ''

  const app = `team-${teamId}-${name}`
  const path = `/applications/argocd/${app}`
  const host = `https://argocd.${domainSuffix}`
  const externalUrl = `${host}${path}`

  return (
    <Link
      to={{
        pathname: externalUrl,
      }}
      target='_blank'
    >
      Application
    </Link>
  )
}

type Status = 'Unknown' | 'Pending' | 'Succeeded' | 'NotFound'

export const getStatus = (status?: Status) => {
  if (!status || status === 'NotFound') return <CircularProgress size='22px' />

  switch (status) {
    case 'Unknown':
      return <Iconify color='#FF4842' icon='eva:alert-circle-fill' width={22} height={22} />

    case 'Pending':
      return <Iconify color='#FFC107' icon='eva:alert-triangle-fill' width={22} height={22} />

    case 'Succeeded':
      return <Iconify color='#54D62C' icon='eva:checkmark-circle-2-fill' width={22} height={22} />

    default:
      return <CircularProgress size='22px' />
  }
}

export default function WorkloadsOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    oboTeamId,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()

  const { statuses } = useSocket()
  const { t } = useTranslation()

  const {
    data: allWorkloads,
    isLoading: isLoadingAllWorkloads,
    isFetching: isFetchingAllWorkloads,
    refetch: refetchAllWorkloads,
  } = useGetAllAplWorkloadsQuery(teamId ? skipToken : undefined)

  const {
    data: teamWorkloads,
    isLoading: isLoadingTeamWorkloads,
    isFetching: isFetchingTeamWorkloads,
    refetch: refetchTeamWorkloads,
  } = useGetTeamAplWorkloadsQuery(teamId ? { teamId } : skipToken)

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false) return

    if (!teamId && !isFetchingAllWorkloads) refetchAllWorkloads()
    else if (teamId && !isFetchingTeamWorkloads) refetchTeamWorkloads()
  }, [isDirty])

  const headCells: HeadCell[] = [
    {
      id: 'metadata.name',
      label: t('Name'),
      renderer: (row: Row) => getWorkloadLink(row),
    },
    {
      id: 'argocd',
      label: t('Argocd'),
      renderer: (row: Row) => getArgocdApplicationLink(row, domainSuffix),
    },
    {
      id: 'spec.imageUpdateStrategy.type',
      label: t('Image update strategy'),
      renderer: (row: Row) => row?.spec?.imageUpdateStrategy?.type ?? '',
    },
    {
      id: 'Status',
      label: 'Status',
      renderer: (row: Row) => getStatus(statuses?.workloads?.[row.metadata?.name]),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'metadata.labels.apl.io/teamId',
      label: t('Team'),
      renderer: (row: Row) => row.metadata?.labels?.['apl.io/teamId'] ?? '',
    })
  }

  const loading = isLoadingAllWorkloads || isLoadingTeamWorkloads
  const workloads = teamId ? teamWorkloads : allWorkloads

  const comp = (
    <ListTable
      teamId={teamId}
      headCells={headCells}
      rows={workloads ?? []}
      resourceType='Workload'
      to={`/teams/${teamId || oboTeamId}/catalogs/`}
    />
  )

  return (
    <PaperLayout
      loading={loading}
      comp={comp}
      title={t('TITLE_WORKLOADS', {
        scope: getRole(teamId),
      })}
    />
  )
}
