import { skipToken } from '@reduxjs/toolkit/query/react'
import { HeadCell } from 'components/EnhancedTable'
import InformationBanner from 'components/InformationBanner'
import ListTable from 'components/ListTable'
import { getStatus } from 'components/Workloads'
import useStatus from 'hooks/useStatus'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useGetAllBuildsQuery, useGetTeamBuildsQuery } from 'redux/otomiApi'
import { getRole } from 'utils/data'
import { Box, Tooltip, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import RLink from '../../../components/Link'

interface Row {
  teamId: string
  tag: string
  id: string
  name: string
  imageName: string
  trigger: boolean
  mode: { type: string }
}

const getBuildLink = (row: Row) => {
  const path = `/teams/${row.teamId}/container-images/${encodeURIComponent(row.name)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

const getTektonTaskRunLink = (row: Row, domainSuffix: string) => {
  const path = `/#/namespaces/team-${row.teamId}/pipelineruns/${row.mode.type}-build-${row.name}`
  const triggerPath = `/#/namespaces/team-${row.teamId}/pipelineruns/`
  const host = `https://tekton-${row.teamId}.${domainSuffix}`
  const externalUrl = `${host}/${path}`
  const externalUrlTrigger = `${host}/${triggerPath}`

  if (row.trigger) {
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

function WebhookUrlRenderer({ row }: { row: Row }) {
  const [copied, setCopied] = useState(false)
  const webhookUrl = `http://el-gitea-webhook-${row.name}.team-${row.teamId}.svc.cluster.local:8080`

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link to={{ pathname: webhookUrl }} target='_blank' />
      <Box sx={{ width: '30px' }}>
        {!copied ? (
          <Tooltip title='Copy to clipboard'>
            <ContentCopyIcon sx={{ ml: 1, cursor: 'pointer' }} onClick={handleCopyToClipboard} />
          </Tooltip>
        ) : (
          <Tooltip title='Copied!'>
            <DoneIcon sx={{ ml: 1, cursor: 'pointer' }} />
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}

function RepositoryRenderer({ row, domainSuffix }: { row: Row; domainSuffix: string }) {
  const [copied, setCopied] = useState(false)
  const repository = `harbor.${domainSuffix}/team-${row.teamId}/${row.imageName}`

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(repository)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link to={{ pathname: repository }} target='_blank' />
      <Box sx={{ width: '30px' }}>
        {!copied ? (
          <Tooltip title='Copy to clipboard'>
            <ContentCopyIcon sx={{ ml: 1, cursor: 'pointer' }} onClick={handleCopyToClipboard} />
          </Tooltip>
        ) : (
          <Tooltip title='Copied!'>
            <DoneIcon sx={{ ml: 1, cursor: 'pointer' }} />
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    data: allBuilds,
    isLoading: isLoadingAllBuilds,
    isFetching: isFetchingAllBuilds,
    refetch: refetchAllBuilds,
  } = useGetAllBuildsQuery(teamId ? skipToken : undefined)
  const {
    data: teamBuilds,
    isLoading: isLoadingTeamBuilds,
    isFetching: isFetchingTeamBuilds,
    refetch: refetchTeamBuilds,
  } = useGetTeamBuildsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!teamId && !isFetchingAllBuilds) refetchAllBuilds()
    else if (teamId && !isFetchingTeamBuilds) refetchTeamBuilds()
  }, [isDirty])

  const { t } = useTranslation()
  // END HOOKS

  const {
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()
  const status = useStatus()
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getBuildLink(row),
    },
    {
      id: 'mode',
      label: t('Type'),
      renderer: (row) => row.mode.type,
    },
    {
      id: 'trigger',
      label: t('Webhook URL'),
      renderer: (row: Row) => (row.trigger ? <WebhookUrlRenderer row={row} /> : ''),
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
      id: 'tag',
      label: t('Tag'),
      renderer: (row) => row.tag,
    },
    {
      id: 'Status',
      label: 'Status',
      renderer: (row: Row) => getStatus(status?.builds?.[row.name]),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  const customButtonText = () => (
    <Typography variant='h6' sx={{ fontSize: 16, textTransform: 'none' }}>
      Create container image
    </Typography>
  )

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
