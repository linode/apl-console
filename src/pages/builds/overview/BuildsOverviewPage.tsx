import { skipToken } from '@reduxjs/toolkit/query/react'
import { HeadCell } from 'components/EnhancedTable'
import InformationBanner from 'components/InformationBanner'
import ListTable from 'components/ListTable'
import { getStatus } from 'components/Workloads'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllAplBuildsQuery, useGetTeamAplBuildsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'
import { Box } from '@mui/material'
import { useSocket } from 'providers/Socket'
import RLink from '../../../components/Link'
import CopyToClipboard from '../../../components/CopyToClipboard'

interface Row {
  metadata: {
    name: string
    labels: {
      'apl.io/teamId': string
    }
  }
  spec: {
    tag?: string
    imageName?: string
    trigger?: boolean
    mode?: { type?: string }
  }
}

const getBuildLink = (row: Row) => {
  const teamId = row.metadata?.labels?.['apl.io/teamId']
  const name = row.metadata?.name ?? ''
  const path = `/teams/${teamId}/container-images/${encodeURIComponent(name)}`

  return (
    <RLink to={path} label={name}>
      {name}
    </RLink>
  )
}

const getTektonTaskRunLink = (row: Row, domainSuffix: string) => {
  const teamId = row.metadata?.labels?.['apl.io/teamId']
  const name = row.metadata?.name ?? ''
  const modeType = row.spec?.mode?.type ?? ''
  const trigger = row.spec?.trigger

  const path = `/#/namespaces/team-${teamId}/pipelineruns/${modeType}-build-${name}`
  const triggerPath = `/#/namespaces/team-${teamId}/pipelineruns/`
  const host = `https://tekton-${teamId}.${domainSuffix}`
  const externalUrl = `${host}/${path}`
  const externalUrlTrigger = `${host}/${triggerPath}`

  if (trigger) {
    return (
      <Link to={{ pathname: externalUrlTrigger }} target='_blank'>
        PipelineRun
      </Link>
    )
  }

  return (
    <Link to={{ pathname: externalUrl }} target='_blank'>
      PipelineRun
    </Link>
  )
}

function RepositoryRenderer({ row, domainSuffix }: { row: Row; domainSuffix: string }) {
  const teamId = row.metadata?.labels?.['apl.io/teamId']
  const imageName = row.spec?.imageName ?? ''
  const repository = `harbor.${domainSuffix}/team-${teamId}/${imageName}`

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link to={{ pathname: repository }} target='_blank'>
        {repository}
      </Link>
      <CopyToClipboard text={repository} />
    </Box>
  )
}

interface Params {
  teamId?: string
}

export default function BuildsOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()
  const {
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()
  const { statuses } = useSocket()

  const {
    data: allBuilds,
    isLoading: isLoadingAllBuilds,
    isFetching: isFetchingAllBuilds,
    refetch: refetchAllBuilds,
  } = useGetAllAplBuildsQuery(teamId ? skipToken : undefined)

  const {
    data: teamBuilds,
    isLoading: isLoadingTeamBuilds,
    isFetching: isFetchingTeamBuilds,
    refetch: refetchTeamBuilds,
  } = useGetTeamAplBuildsQuery({ teamId }, { skip: !teamId })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllBuilds) refetchAllBuilds()
    else if (teamId && !isFetchingTeamBuilds) refetchTeamBuilds()
  }, [isDirty])

  const headCells: HeadCell[] = [
    {
      id: 'metadata.name',
      label: t('Name'),
      renderer: (row: Row) => getBuildLink(row),
    },
    {
      id: 'spec.mode.type',
      label: t('Type'),
      renderer: (row: Row) => row.spec?.mode?.type ?? '',
    },
    {
      id: 'tekton',
      label: t('Tekton'),
      renderer: (row: Row) => getTektonTaskRunLink(row, domainSuffix),
    },
    {
      id: 'harbor',
      label: t('Repository'),
      renderer: (row: Row) => <RepositoryRenderer row={row} domainSuffix={domainSuffix} />,
    },
    {
      id: 'spec.tag',
      label: t('Tag'),
      renderer: (row: Row) => row.spec?.tag ?? '',
    },
    {
      id: 'status',
      label: 'Status',
      renderer: (row: Row) => getStatus(statuses?.builds?.[row.metadata?.name]),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'metadata.labels.apl.io/teamId',
      label: t('Team'),
      renderer: (row: Row) => row.metadata?.labels?.['apl.io/teamId'] ?? '',
    })
  }

  const customButtonText = () => <span>Create container image</span>

  const loading = isLoadingAllBuilds || isLoadingTeamBuilds
  const builds = teamId ? teamBuilds : allBuilds

  const comp = !appsEnabled.harbor ? (
    <InformationBanner message='Admin needs to enable the Harbor app to activate this feature.' />
  ) : (
    builds && (
      <ListTable
        teamId={teamId}
        headCells={headCells}
        rows={builds}
        resourceType='Container-image'
        customButtonText={customButtonText()}
      />
    )
  )

  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_CONTAINER_IMAGES', { scope: getRole(teamId) })} />
}
