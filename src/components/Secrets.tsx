import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import { Link } from 'react-router-dom'
import React from 'react'
import { Team } from '@redkubes/otomi-api-client-axios'
import { useSession } from '../session-context'
import EnhancedTable, { HeadCell } from './EnhancedTable'

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
    },
    {
      id: 'type',
      label: 'Type',
    },
    {
      id: 'delete',
      label: 'Delete',
      renderer: row => (
        <Button
          color='primary'
          onClick={() => setDeleteId(row.id)}
          startIcon={<DeleteIcon />}
          variant='contained'
          data-cy={`button-delete-${row.name}`}
        >
          Delete
        </Button>
      ),
    },
  ]
  return (
    <>
      <h1 data-cy='h1-secrets-page'>{!team ? 'Secrets' : `Secrets (team ${team.id})`}</h1>
      <Box mb={1}>
        {oboTeamId && (
          <Button
            component={Link}
            to={isAdmin ? '/create-secret' : `/teams/${oboTeamId}/create-secret`}
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            disabled={isAdmin && !oboTeamId}
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
