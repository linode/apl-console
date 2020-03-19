import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import ActionBar from '../ActionBar'

const getServiceLink = (cell, row, rowIndex, formatExtraData): any => {
  const link = `/teams/${row.teamName}/services/${row.serviceName}`
  return <Link to={link}>{row.name}</Link>
}

const columns = [
  {
    dataField: 'name',
    text: 'Service name',
    formatter: getServiceLink,
  },
  {
    dataField: 'teamName',
    text: 'Team',
  },
  {
    dataField: 'clusterId',
    text: 'Cluster',
  },
  {
    dataField: 'isInternal',
    text: 'isInternal',
  },
  {
    dataField: 'domain',
    text: 'Domain',
  },
  {
    dataField: 'isPublic',
    text: 'isPublic',
  },
]

const Services = ({ services, isAdmin }): any => {
  return (
    <div className='Services'>
      {!isAdmin && (
        <ActionBar>
          <Button variant='primary' size='sm' active>
            <Link to='/services-create'>+ new service</Link>
          </Button>
        </ActionBar>
      )}
      <BootstrapTable bootstrap4 keyField='name' data={services} columns={columns} />
    </div>
  )
}

export default Services
