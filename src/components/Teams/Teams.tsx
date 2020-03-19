import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import ActionBar from '../ActionBar'

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
      <Button variant='primary' size='sm' active>
        <Link to='/teams-create'>+ new team</Link>
      </Button>
    </ActionBar>
  )
}

export default ({ teams }): any => {
  return (
    <div className='Teams'>
      <React.Fragment>
        <h2>Teams</h2>
        <TeamActionBar />
        <BootstrapTable bootstrap4 keyField='name' data={teams} columns={columns} />
      </React.Fragment>
    </div>
  )
}
