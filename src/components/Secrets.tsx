import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { Link } from 'react-router-dom'
import React from 'react'
import { Team } from '@redkubes/otomi-api-client-axios'
import RLink from './Link'
import { useSession } from '../session-context'
import EnhancedTable, { HeadCell } from './EnhancedTable'

const getSecretLink = (isAdmin, ownerId) => row => {
  const { teamId, id, name } = row
  if (!(isAdmin || teamId === ownerId)) return name

  const link = isAdmin ? `/secrets/${encodeURIComponent(id)}` : `/teams/${teamId}/secrets/${encodeURIComponent(id)}`
  return (
    <RLink to={link} label={name}>
      {name}
    </RLink>
  )
}

interface Props {
  secrets: any[]
  team?: Team
  setDeleteId: CallableFunction
}

export default ({ secrets, team, setDeleteId }: Props) => {
  const {
    user: { isAdmin },
    oboTeamId,
  } = useSession()
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Name',
      renderer: getSecretLink(isAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: 'Type',
    },
    {
      id: 'delete',
      label: 'Delete',
      renderer: row => (
        <DeleteForeverIcon
          onClick={() => setDeleteId(row.id)}
          color='primary'
          // disabled={isAdmin && !oboTeamId}
          data-cy={`button-delete-${row.name}`}
        />
      ),
    },
  ]
  if (isAdmin && !team)
    headCells.splice(2, 0, {
      id: 'namespace',
      label: 'namespace',
      renderer: row => {
        return row.namespace || `team-${row.teamId}`
      },
    })
  return (
    <>
      <h1 data-cy='h1-secrets-page'>{!oboTeamId ? 'Secrets' : `Secrets (team ${oboTeamId})`}</h1>
      <Box mb={1}>
        {(isAdmin || oboTeamId) && (
          <Button
            component={Link}
            to={isAdmin && !oboTeamId ? '/create-secret' : `/teams/${oboTeamId}/create-secret`}
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            disabled={!isAdmin && !oboTeamId}
            data-cy='button-create-secret'
          >
            Create secret
          </Button>
        )}
      </Box>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={secrets} idKey='id' />
    </>
  )
}
