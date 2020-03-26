import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'

const getTeamLink = (cell, row, rowIndex, formatExtraData): any => {
  return <Link to={`/teams/${row.name}`}>{row.name}</Link>
}

const columns = [
  {
    dataField: 'name',
    text: 'Team name',
    formatter: getTeamLink,
  },
]

const TeamActionBar = (): any => {
  return (
    <Box mb={1}>
      <Button
        component={Link}
        to='/create-team'
        startIcon={<AddCircleIcon />}
        variant='contained'
        color='primary'
        className={'createTeam'}
      >
        Create team
      </Button>
    </Box>
  )
}

export default ({ teams }): any => {
  const { isAdmin } = useSession()

  return (
    <div className='Teams'>
      <h2>Teams</h2>
      {isAdmin && <TeamActionBar />}
      <BootstrapTable bootstrap4 keyField='name' data={teams} columns={columns} />
    </div>
  )
}
