import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Box, Button } from '@mui/material'
import { useSession } from 'providers/Session'
import React from 'react'
import { Link } from 'react-router-dom'
import { GetTeamsApiResponse } from 'store/otomi'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'

interface Props {
  teams: GetTeamsApiResponse
}

export default function ({ teams }: Props): React.ReactElement {
  const {
    user: { isAdmin },
  } = useSession()
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Team Name',
      renderer: ({ id }: any) =>
        isAdmin ? (
          <RLink to={`/teams/${id}`} label={id}>
            {id}
          </RLink>
        ) : (
          id
        ),
    },
  ]

  return (
    <>
      <h1 data-cy='h1-teams-page'>Teams</h1>
      {isAdmin && (
        <Box mb={1}>
          <Button
            component={Link}
            to='/create-team'
            startIcon={<AddCircleIcon />}
            className='createTeam'
            data-cy='button-create-team'
          >
            Create team
          </Button>
        </Box>
      )}
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={teams} idKey='id' />
    </>
  )
}
