import React from 'react'
import RLink from './Link'
import MuiLink from './MuiLink'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import { useSession } from '../session-context'

export default (): React.ReactElement => {
  const { clusters }: any = useSession()
  const headCells: HeadCell[] = [
    {
      id: 'id',
      label: 'ID',
      renderer: ({ id }: any) => (
        <RLink to={`/cluster/${encodeURIComponent(id)}`} label={id}>
          {id}
        </RLink>
      ),
    },
    {
      id: 'domain',
      label: 'Domain',
      renderer: ({ domain }: any) => (
        <MuiLink href={`https://otomi.${domain}/`} target='_blank' rel='noopener'>
          {domain}
        </MuiLink>
      ),
    },
    {
      id: 'region',
      label: 'Region',
    },
    {
      id: 'k8sVersion',
      label: 'K8S Version',
    },
    {
      id: 'otomiVersion',
      label: 'Otomi Version',
    },
  ]
  return (
    <>
      <h1 data-cy='h1-clusters-page'>Clusters</h1>
      <EnhancedTable
        disableSelect
        headCells={headCells}
        orderByStart='name'
        rows={clusters.filter((c) => c.enabled)}
        idKey='id'
      />
    </>
  )
}
