import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'
import RLink from './Link'
import EnhancedTable, { HeadCell } from './EnhancedTable'

interface Props {
  teams: any[]
}

export default ({ teams }: Props) => {
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
    {
      id: 'cloud',
      label: 'Cloud',
      renderer: row => row.clusters.map(c => c.substr(0, c.indexOf('/'))).join(', '),
    },
    {
      id: 'id',
      label: 'Cluster',
      renderer: row => row.clusters.join(', '),
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
            variant='contained'
            color='primary'
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
