import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import { useApi } from '../hooks/api'
import { Team } from '../models'
import { useSession } from '../session-context'
import EnhancedTable, { HeadCell } from './EnhancedTable'

interface DelProps {
  name: string
  namespace?: string
  setDel: CallableFunction
}

const Delete = ({ name, setDel, namespace }: DelProps) => {
  const [result] = useApi('deleteSecret', { name, namespace }, null)
  if (result) {
    setDel()
  }
  return null
}

interface Props {
  secrets: any[]
  team: Team
}

export default ({ secrets, team }: Props): any => {
  const {
    user: { teamId: sessTeamId, isAdmin },
  } = useSession()
  const [del, setDel] = useState()
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
      id: 'name',
      label: 'Delete',
      renderer: row => (
        <Button color='primary' onClick={() => setDel(row.name)} startIcon={<DeleteIcon />} variant='contained'>
          Delete
        </Button>
      ),
    },
    {
      id: 'cloud',
      label: 'Cloud',
    },
  ]
  return (
    <>
      {del && <Delete name={del} setDel={setDel} />}
      <h1>Secrets{team ? `: Team ${team.name}` : ''}</h1>
      <Box mb={1}>
        {(isAdmin || team) && (
          <Button
            component={Link}
            to={isAdmin ? '/create-secret' : `/teams/${team.id}/create-secret`}
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            disabled={isAdmin && !sessTeamId}
          >
            Create secret
          </Button>
        )}
      </Box>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={secrets} idKey='name' />
    </>
  )
}
