import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetTeamBuildsApiResponse } from 'redux/otomiApi'
import { Box, Tooltip, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import { useSocket } from 'providers/Socket'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import { getStatus } from './Workloads'
import InformationBanner from './InformationBanner'

interface Row {
  teamId: string
  tag: string
  id: string
  name: string
  trigger: boolean
  mode: { type: string }
}

const getBuildLink = (row: Row) => {
  const path = `/teams/${row.teamId}/builds/${encodeURIComponent(row.name)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

const getTektonTaskRunLink = (row: Row, domainSuffix: string) => {
  const formattedTag = row.tag.replace(/[._]/g, '-')

  const path = `/#/namespaces/team-${row.teamId}/pipelineruns/${row.mode.type}-build-${row.name}-${formattedTag}`
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
  const repository = `harbor.${domainSuffix}/team-${row.teamId}/${row.name}`

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

interface Props {
  builds: GetTeamBuildsApiResponse
  teamId?: string
}

export default function ({ builds, teamId }: Props): React.ReactElement {
  const {
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()
  const { statuses } = useSocket()

  const { t } = useTranslation()
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
      renderer: (row: Row) => getStatus(statuses?.builds?.[row.name]),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  if (!appsEnabled.harbor)
    return <InformationBanner message='Admin needs to enable the Harbor app to activate this feature.' />

  const customButtonText = () => (
    <Typography variant='h6' sx={{ fontSize: 16, textTransform: 'none' }}>
      Add Build
    </Typography>
  )

  return (
    <ListTable
      teamId={teamId}
      headCells={headCells}
      rows={builds}
      resourceType='Build'
      customButtonText={customButtonText()}
    />
  )
}
