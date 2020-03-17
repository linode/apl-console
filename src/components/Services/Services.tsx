import React, { useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/api'
import ActionBar from '../ActionBar'
import ModalWrapper from '../Modal'
import CreateService from './CreateService'

function ServiceTable(props): any {
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

  return <BootstrapTable bootstrap4 keyField='name' data={props.services} columns={columns} />
}

const Services: React.FC = ({ team, teamId, serviceId, schema }: any): any => {
  const [modalState, setModalState] = useState(false)
  const [services, loading, error] =
    team === undefined ? useApi('getAllServices') : useApi('getServiceCollectionFromTeam', team.name)

  const showModal = (): any => {
    setModalState(true)
  }

  const hideModal = (): any => {
    setModalState(false)
  }

  const getModal = (): any => {
    const body = <CreateService schema={schema} clusters={team.clusters} teamId={team.name} onSubmitted={hideModal} />
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
