import { Box, Button } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { isEmpty } from 'lodash/lang'
import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Link } from 'react-router-dom'
import { useSession } from '../session-context'

const getServiceLink = (cell, row, rowIndex, formatExtraData): any => {
  const link = `/teams/${row.teamId}/services/${row.name}`
  return <Link to={link}>{row.name}</Link>
}

const getPublicUrl = (cell, row, rowIndex, formatExtraData): any => {
  if (isEmpty(row.ingress)) {
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
    dataField: 'clusterId',
    text: 'Cluster',
  },
]

const Services = ({ services, teamId }): any => {
  const { isAdmin, team } = useSession()
  let myColumns = columns
  if (!teamId) {
    myColumns = [...columns]
    myColumns.splice(1, 0, {
      dataField: 'teamId',
      text: 'Team',
    })
  }
  return (
    <div className='Services'>
      {!isAdmin && teamId && (
        <Box mb={1}>
          <Button
            component={Link}
            to={`/teams/${team.name}/create-service`}
            startIcon={<AddCircleIcon />}
            variant='contained'
            color='primary'
            className={'createService'}
          >
            Create service
          </Button>
        </Box>
      )}
      <h2>Services:</h2>
      <BootstrapTable bootstrap4 keyField='serviceId' data={services} columns={myColumns} />
    </div>
  )
}

export default Services
