import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'

const columns = [
  {
    dataField: 'cluster',
    text: 'Cluster name',
  },
  {
    dataField: 'cloud',
    text: 'Cloud',
  },
  {
    dataField: 'domain',
    text: 'Domain',
  },
  // {
  //   dataField: 'teams',
  //   text: 'Team',
  //   formatter: (cell, row, rowIndex, formatExtraData): any => {
  //     return row.teams.concat(', ')
  //   },
  // },
]

export default ({ clusters }): any => {
  return (
    <div className='Cluster'>
      <h2>Clusters:</h2>
      <BootstrapTable bootstrap4 keyField='clusterId' data={clusters} columns={columns} />
    </div>
  )
}
