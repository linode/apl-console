import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { useApi } from '../hooks/api'
import { Team } from '../models'
import { useSession } from '../session-context'
import EnhancedTable, { HeadCell } from './EnhancedTable'

interface Props {
  secrets: any[]
  setDeleteId: CallableFunction
}

export default ({ secrets, setDeleteId }: Props): any => {
  const {
    user: { teamId, isAdmin },
    oboTeamId,
  } = useSession()
  const sessTeamId = isAdmin ? oboTeamId : teamId
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
        <Button color='primary' onClick={() => setDeleteId(row.id)} startIcon={<DeleteIcon />} variant='contained'>
          Delete
        </Button>
      ),
    },
  ]
  return (
    <>
      <h1>Secrets{isAdmin && sessTeamId ? ` (team ${sessTeamId})` : ''}</h1>
      <Box mb={1}>
        {(isAdmin || teamId) && (
          <Button
            component={Link}
            to={isAdmin ? '/create-secret' : `/teams/${teamId}/create-secret`}
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            disabled={isAdmin && !sessTeamId}
          >
            Create secret
          </Button>
        )}
      </Box>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={secrets} idKey='id' />
    </>
  )
}
