import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetTeamBuildsApiResponse, useStatusMutation } from 'redux/otomiApi'
import { Box, CircularProgress, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'
import Iconify from './Iconify'

interface Row {
  teamId: string
  tag: string
  id: string
  name: string
  trigger: boolean
  mode: { type: string }
}

const getBuildLink = (row: Row) => {
  const path = `/teams/${row.teamId}/builds/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

const getTektonTaskRunLink = (row: Row, domainSuffix: string) => {
  const path = `/#/namespaces/team-${row.teamId}/pipelineruns/${row.mode.type}-build-${row.name}-${row.tag}`
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

const getStatus = (row: Row, statuses: any) => {
  const status = statuses?.[row.name]
  if (!status || status.status === 'NotFound') return <CircularProgress size='22px' />

  switch (status.status) {
    case 'Failed':
      return <Iconify color='#FF4842' icon='eva:alert-circle-fill' width={22} height={22} />
    // case 'OutOfSync':
    //   return <Iconify color='#FFC107' icon='eva:alert-triangle-fill' width={22} height={22} />
    case 'Succeeded':
      return <Iconify color='#54D62C' icon='eva:checkmark-circle-2-fill' width={22} height={22} />
    default:
      return <CircularProgress size='22px' />
  }
}

interface Props {
  builds: GetTeamBuildsApiResponse
  teamId?: string
}

export default function ({ builds, teamId }: Props): React.ReactElement {
  const url = `${window.location.origin.replace(/^http/, 'ws')}`
  const path = '/api/ws'
  const { socket } = useSocket({ url, path })
  const { lastMessage } = useSocketEvent<any>(socket, 'builds')
  console.log('builds:', lastMessage)
  const [startStopStatus] = useStatusMutation()

  useEffect(() => {
    let intervalId: number
    startStopStatus({ body: { resource: 'builds', operation: 'start' } }).then((res: any) => {
      intervalId = res.data
    })
    return () => {
      startStopStatus({ body: { resource: 'builds', operation: 'stop', intervalId } })
    }
  }, [])
  // const {
  //   oboTeamId,
  //   user: { isAdmin },
  // } = useSession()
  const {
    appsEnabled,
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()

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
      renderer: (row: Row) => getStatus(row, lastMessage),
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  if (!appsEnabled.harbor) return <p>Admin needs to enable the Harbor app to activate this feature.</p>

  return <ListTable teamId={teamId} headCells={headCells} rows={builds} resourceType='Build' />
}
