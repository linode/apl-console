import { skipToken } from '@reduxjs/toolkit/query/react'
import { HeadCell } from 'components/EnhancedTable'
import InformationBanner from 'components/InformationBanner'
import ListTable from 'components/ListTable'
import { getStatus } from 'components/Workloads'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllAplBuildsQuery, useGetTeamAplBuildsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'
import { Box, Typography, useTheme } from '@mui/material'
import { useSocket } from 'providers/Socket'
import CopyToClipboard from 'components/CopyToClipboard'
import MuiLink from 'components/MuiLink'
import useSettings from 'hooks/useSettings'
import RLink from '../../../components/Link'

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
  const [hovered, setHovered] = useState(false)
  const theme = useTheme()

  const teamId = row.metadata?.labels?.['apl.io/teamId']
  const imageName = row.spec?.imageName ?? ''
  const repository = `harbor.${domainSuffix}/team-${teamId}/${imageName}`

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minWidth: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Typography
        sx={{
          color: theme.palette.text.primary,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {repository}
      </Typography>

      <Box sx={{ ml: 1, flexShrink: 0 }}>
        <CopyToClipboard text={repository} visible={hovered} />
      </Box>
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
    user,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()
  const { isPlatformAdmin } = user
  const { statuses } = useSocket()
  const { onToggleView } = useSettings()
  const history = useHistory()

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

  const loading = isLoadingAllBuilds || isLoadingTeamBuilds
  const builds = teamId ? teamBuilds : allBuilds

  const appsMissing = !appsEnabled.tekton || !appsEnabled.harbor

  const handleAppsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    onToggleView()

    history.push('/apps/admin')
  }

  const bannerMessage = isPlatformAdmin ? (
    <>
      Container Images requires Tekton and Harbor to be enabled. Click{' '}
      <MuiLink href='/apps/admin' onClick={handleAppsClick}>
        here
      </MuiLink>{' '}
      to enable them.
    </>
  ) : (
    'Admin needs to enable the Tekton and Harbor app to activate this feature.'
  )

  const comp = (
    <>
      {appsMissing && <InformationBanner message={bannerMessage} />}

      <ListTable
        teamId={teamId}
        headCells={headCells}
        rows={appsMissing ? [] : builds ?? []}
        resourceType='Container-image'
        customButtonText={<span>Create container image</span>}
        createButtonDisabled={appsMissing}
      />
    </>
  )

  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_CONTAINER_IMAGES', { scope: getRole(teamId) })} />
}
