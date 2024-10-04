import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GetAllUsersApiResponse, GetSessionApiResponse, useEditTeamUsersMutation } from 'redux/otomiApi'
import { Box, Button, Checkbox, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import useSettings from 'hooks/useSettings'
import ListTable from './ListTable'
import RLink from './Link'
import { HeadCell } from './EnhancedTable'

interface Row {
  id: string
  email: string
  isTeamAdmin: boolean
  teams: string[]
  initialPassword: string
}

const getUserLink = (row: Row) => {
  const path = `/users/${encodeURIComponent(row.id)}`
  return (
    <RLink to={path} label={row.email}>
      {row.email}
    </RLink>
  )
}

function CredentialsRenderer({ row, hostname }: { row: Row; hostname: string }) {
  const [copied, setCopied] = useState(false)
  const message = `
  ###########################################################
  You can start using APL. Visit: https://${hostname}
  Sign in to the web console with the following credentials:
    - Username: ${row.email}
    - Password: ${row.initialPassword}
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

function UserTeamSelector({
  row,
  sessionUser,
  users,
  setUsers,
  teamId,
}: {
  row: Row
  sessionUser: GetSessionApiResponse['user']
  users: GetAllUsersApiResponse
  setUsers: React.Dispatch<React.SetStateAction<GetAllUsersApiResponse>>
  teamId: string
}) {
  const user = users.find((user) => user.id === row.id)
  const isDisabled =
    sessionUser.email === row.email || user.isPlatformAdmin || (user.isTeamAdmin && user.teams.includes(teamId))
  const handleUserTeamToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = event.target.checked
    setUsers((users: GetAllUsersApiResponse) =>
      users.map((user) => {
        if (user.id === row.id) {
          const updatedTeams = isSelected
            ? [...user.teams, teamId]
            : user.teams.filter((team: string) => team !== teamId)

          return { ...user, teams: updatedTeams }
        }
        return user
      }),
    )
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox disabled={isDisabled} checked={row.teams.includes(teamId)} onChange={handleUserTeamToggle} />
    </Box>
  )
}

const updateUsers = (onClick: () => void) => {
  return (
    <Button variant='contained' onClick={onClick}>
      Update Users
    </Button>
  )
}

interface Props {
  users: GetAllUsersApiResponse
  teamId?: string
}

export default function ({ users: inUsers, teamId }: Props): React.ReactElement {
  const [users, setUsers] = useState<GetAllUsersApiResponse>(inUsers)
  const {
    user: sessionUser,
    oboTeamId,
    settings: {
      otomi: { hasExternalIDP },
    },
  } = useSession()
  const { t } = useTranslation()
  const { themeView } = useSettings()
  const isTeamView = themeView === 'team'
  const hostname = window.location.hostname
  const [update] = useEditTeamUsersMutation()

  useEffect(() => {
    setUsers(inUsers)
  }, [inUsers])

  // END HOOKS
  const credentials = !isTeamView
    ? [
        {
          id: 'credentials',
          label: t('Initial Credentials'),
          renderer: (row: Row) => <CredentialsRenderer row={row} hostname={hostname} />,
        },
      ]
    : []
  const assignToTeam =
    isTeamView && oboTeamId !== 'admin'
      ? [
          {
            id: 'assign',
            label: t(`Assign to team ${oboTeamId}`),
            renderer: (row: Row) => (
              <UserTeamSelector
                row={row}
                sessionUser={sessionUser}
                users={inUsers}
                setUsers={setUsers}
                teamId={teamId}
              />
            ),
          },
        ]
      : []
  const headCells: HeadCell[] = [
    {
      id: 'email',
      label: t('Email'),
      renderer: (row: Row) => (isTeamView ? row.email : getUserLink(row)),
    },
    ...credentials,
    ...assignToTeam,
  ]

  const handleUpdateUsers = () => {
    update({ teamId, body: users })
  }

  if (hasExternalIDP) return <p>User management is only available when using the internal identity provider (IDP).</p>

  return (
    <ListTable
      teamId={teamId}
      headCells={headCells}
      rows={users}
      resourceType='User'
      title='Users'
      noCrud={isTeamView}
      customButton={isTeamView && updateUsers(handleUpdateUsers)}
    />
  )
}
