import React from 'react'
import RLink from './Link'
import MuiLink from './MuiLink'
import EnhancedTable, { HeadCell } from './EnhancedTable'

interface Props {
  clusters: any[]
}

export default ({ clusters }: Props): any => {
  const teamPrefix = 'team-' // @todo: get from values later
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Name',
      renderer: row => <RLink to={`/cluster/${encodeURIComponent(row.id)}`}>{row.id}</RLink>,
    },
    {
      id: 'domain',
      label: 'Domain',
      renderer: row => <MuiLink href={`https://otomi.${teamPrefix}admin.${row.domain}`}>{row.domain}</MuiLink>,
    },
    {
      id: 'cloud',
      label: 'Cloud',
    },
    {
      id: 'clusterId',
      label: 'Cluster',
    },
  ]
  return (
    <>
      <h1>Clusters</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={clusters} idKey='clusterId' />
    </>
  )
}
