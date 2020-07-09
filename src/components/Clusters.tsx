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
      id: 'id',
      label: 'ID',
      renderer: (row: any) => <RLink to={`/cluster/${encodeURIComponent(row.id)}`} label={row.id}>{row.id}</RLink>,
    },  
    {
      id: 'domain',
      label: 'Domain',
      renderer: (row: any) => (
        <MuiLink href={`https://apps.${teamPrefix}admin.${row.domain}/otomi/`} target='_blank' rel='noopener'>
          {row.domain}
        </MuiLink>
      ),
    },
    {
      id: 'cloud',
      label: 'Cloud',
    },
  ]
  return (
    <>
      <h1 data-cy='h1-clusters-page'>Clusters</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={clusters} idKey='id' />
    </>
  )
}
