import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GetAllUsersApiResponse, GetSessionApiResponse, useEditTeamUsersMutation } from 'redux/otomiApi'
import { Box, Button, Checkbox, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'
import useSettings from 'hooks/useSettings'
import { isEqual } from 'lodash'
import ListTable from './ListTable'
import RLink from './Link'
import { HeadCell } from './EnhancedTable'
import InformationBanner from './InformationBanner'

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

function CredentialsRenderer({ row }: { row: Row }) {
  const [copied, setCopied] = useState(false)
  const message = row.initialPassword
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
          <Tooltip title='Copy initial password to clipboard'>
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
    sessionUser.email === row.email || user?.isPlatformAdmin || (user?.isTeamAdmin && user?.teams.includes(teamId))
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
      <Tooltip
        title={
          isDisabled
            ? 'Team admins are permitted to add or remove users only within the teams they manage. However, they cannot remove themselves or other team admins from those teams.'
            : ''
        }
        placement='right'
      >
        <span>
          <Checkbox disabled={isDisabled} checked={row?.teams?.includes(teamId)} onChange={handleUserTeamToggle} />
        </span>
      </Tooltip>
    </Box>
  )
}

const updateUsers = (onClick: () => void, disabled: boolean) => {
  return (
    <Button variant='contained' onClick={onClick} disabled={disabled}>
      Update Users
    </Button>
  )
}

interface Props {
  users: GetAllUsersApiResponse
  teamId?: string
  refetch: () => void
}

export default function ({ users: inUsers, teamId, refetch }: Props): React.ReactElement {
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
  const [update] = useEditTeamUsersMutation()

  useEffect(() => {
    setUsers(inUsers)
  }, [inUsers])

  // END HOOKS
  const credentials = !isTeamView
    ? [
        {
          id: 'initialPassword',
          label: t('Initial Password'),
          renderer: (row: Row) => <CredentialsRenderer row={row} />,
        },
      ]
    : []
  const assignToTeam = isTeamView
    ? [
        {
          id: 'assign',
          label: t(`Assign to team ${oboTeamId}`),
          renderer: (row: Row) => (
            <UserTeamSelector row={row} sessionUser={sessionUser} users={inUsers} setUsers={setUsers} teamId={teamId} />
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
    const body = users.map((user) => ({
      id: user.id,
      teams: user.teams || [],
    }))
    update({ teamId, body }).then(() => {
      refetch()
    })
  }

  if (hasExternalIDP) {
    return (
      <InformationBanner message='User management is only available when using the internal identity provider (IDP).' />
    )
  }

  return (
    <ListTable
      teamId={teamId}
      headCells={headCells}
      rows={users}
      resourceType='User'
      title='Users'
      noCrud={isTeamView}
      customButton={isTeamView && updateUsers(handleUpdateUsers, isEqual(users, inUsers))}
    />
  )
}
