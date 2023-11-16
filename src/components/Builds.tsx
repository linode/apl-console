import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { GetTeamBuildsApiResponse } from 'redux/otomiApi'
import { Box, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

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

function RepositoryRenderer({ row, domainSuffix }: { row: Row; domainSuffix: string }) {
  const [copied, setCopied] = useState(false)
  const path = `harbor/projects/team-${row.teamId}/repositories/${row.name}/artifacts-tab`
  const host = `https://harbor.${domainSuffix}`
  const externalUrl = `${host}/${path}`
  const registry = `harbor.${domainSuffix}/team-${row.teamId}/${row.name}`

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(externalUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link to={{ pathname: externalUrl }} target='_blank'>
        {registry}
      </Link>
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
      label: t('Trigger'),
      renderer: (row) => (row.trigger ? 'Yes' : 'No'),
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
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  if (!appsEnabled.tekton || !appsEnabled.harbor)
    return <p>Admin needs to enable the Tekton and Harbor apps to activate this feature.</p>

  return <ListTable teamId={teamId} headCells={headCells} rows={builds} resourceType='Build' />
}
