import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GetTeamUsersApiResponse } from 'redux/otomiApi'
import { Box, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import ListTable from './ListTable'
import RLink from './Link'
import { HeadCell } from './EnhancedTable'

interface Row {
  teamId: string
  tag: string
  id: string
  name: string
  trigger: boolean
  mode: { type: string }
}

const getUserLink = (row: Row) => {
  const path = `/teams/${row.teamId}/users/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.name}>
      {row.name}
    </RLink>
  )
}

function CredentialsRenderer({ row, hostname }: { row: Row; hostname: string }) {
  const [copied, setCopied] = useState(false)
  const message = `
  ###########################################################
  You can start using APL. Visit: https://${hostname}
  Sign in to the web console with the following credentials:
    - Username: ${row.name}
    - Password: ${row.name}@APL
  You will be prompted to change your password after the first login.
  ###########################################################
  `

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '30px' }}>
        {!copied ? (
          <Tooltip title='Copy initial credentials to clipboard'>
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
  users: GetTeamUsersApiResponse
  teamId?: string
}

export default function ({ users, teamId }: Props): React.ReactElement {
  const { user } = useSession()
  const { t } = useTranslation()
  const hostname = window.location.hostname
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: (row: Row) => getUserLink(row),
    },
    {
      id: 'email',
      label: t('Email'),
      renderer: (row) => row.email,
    },
    {
      id: 'credentials',
      label: t('Credentials'),
      renderer: (row: Row) => <CredentialsRenderer row={row} hostname={hostname} />,
    },
  ]

  if (!teamId) {
    headCells.push({
      id: 'teamId',
      label: t('Team'),
    })
  }

  return <ListTable teamId={teamId} headCells={headCells} rows={users} resourceType='User' />
}
