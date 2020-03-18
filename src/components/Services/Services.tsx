import React, { useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/api'
import { useSession } from '../../session-context'
import ActionBar from '../ActionBar'
import ModalWrapper from '../Modal'
import CreateService from './CreateService'

function ServiceTable({ services }): any {
  function getServiceLink(cell, row, rowIndex, formatExtraData): any {
    const link = `/teams/${row.teamId}/services/${row.serviceId}`
    return <Link to={link}>{row.name}</Link>
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

  return <BootstrapTable bootstrap4 keyField='name' data={services} columns={columns} />
}

const Services = (): any => {
  const { team } = useSession()
  const [modalState, setModalState] = useState(false)
  const method = team === undefined ? 'getAllServices' : 'getServiceCollectionFromTeam'
  const [services, loading, error] = useApi(method, team.name)

  const showModal = (): any => {
    setModalState(true)
  }

  const hideModal = (): any => {
    setModalState(false)
  }

  const getModal = (): any => {
    const body = <CreateService onSubmit={hideModal} />
    return <ModalWrapper title='Create service' body={body} onClose={hideModal} />
  }

  const renderServiceCollection = (): any => {
    return (
      <React.Fragment>
        {ServiceActionBar()}
        <ServiceTable services={services} />
      </React.Fragment>
    )
  }

  const ServiceActionBar = (): any => {
    if (team === undefined) {
      return
    }

    return (
      <ActionBar>
        <Button variant='primary' size='sm' active onClick={showModal}>
          + new service
        </Button>
      </ActionBar>
    )
  }

  if (error) {
    return <p>{'Error: ' + error}</p>
  }
  if (loading) {
    return <p>{'Loading'}</p>
  }

  const body = modalState ? getModal() : renderServiceCollection()

  return <div className='Services'>{body}</div>
}

export default Services
