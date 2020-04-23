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

export default ({ teams }: Props): any => {
  const {
    user: { isAdmin },
  } = useSession()
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Team Name',
      renderer: row => (isAdmin ? <RLink to={`/teams/${row.teamId}`}>{row.name}</RLink> : row.name),
    },
    {
      id: 'clouds',
      label: 'Clouds',
      renderer: row => row.clusters.map(c => c.substr(0, c.indexOf('/'))).join(', '),
    },
    {
      id: 'clusterId',
      label: 'Cluster',
      renderer: row => row.clusters.join(', '),
    },
  ]

  return (
    <>
      <h1>Teams</h1>
      {isAdmin && (
        <Box mb={1}>
          <Button
            component={Link}
            to='/create-team'
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            className='createTeam'
          >
            Create team
          </Button>
        </Box>
      )}
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={teams} idKey='teamId' />
    </>
  )
}
