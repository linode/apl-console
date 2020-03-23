import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'
import ActionBar from './ActionBar'

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
    <ActionBar>
      <Button variant='info' size='sm'>
        <Link to='/create-team'>+ new team</Link>
      </Button>
    </ActionBar>
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
