import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'
import ActionBar from './ActionBar'

const getServiceLink = (cell, row, rowIndex, formatExtraData): any => {
  const link = `/teams/${row.teamId}/services/${row.name}`
  return <Link to={link}>{row.name}</Link>
}

const getPublicUrl = (cell, row, rowIndex, formatExtraData): any => {
  if (!row.ingress.hasPublicUrl) {
    return '-'
  }
  return `${row.ingress.domain}.${row.ingress.domain}`
}

const columns = [
  {
    dataField: 'name',
    text: 'Service name',
    formatter: getServiceLink,
  },
  {
    dataField: 'teamId',
    text: 'Team',
  },
  {
    dataField: 'clusterId',
    text: 'Cluster',
  },
  {
    dataField: 'spec.serviceType',
    text: 'Type',
  },
  {
    dataField: 'customField',
    text: 'Public URL',
    formatter: getPublicUrl,
  },
]

const Services = ({ services }): any => {
  const { isAdmin, team } = useSession()
  return (
    <div className='Services'>
      {!isAdmin && (
        <ActionBar>
          <Button variant='info' size='sm'>
            <Link to={`/teams/${team.name}/create-service`}>+ new service</Link>
          </Button>
        </ActionBar>
      )}
      <h2>Services:</h2>
      <BootstrapTable bootstrap4 keyField='serviceId' data={services} columns={columns} />
    </div>
  )
}

export default Services
