import React from 'react'
import { Cluster } from '@redkubes/otomi-api-client-axios'
import MuiLink from './MuiLink'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import { useSession } from '../session-context'

export default (): React.ReactElement => {
  const { cluster, clusters } = useSession()
  const allClusters = [...clusters, cluster]
  const headCells: HeadCell[] = [
    {
      id: 'provider',
      label: 'Provider',
    },
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'url',
      label: 'Url',
      renderer: (c: Cluster) => {
        const { domainSuffix } = c
        const domain = `otomi.${domainSuffix}`
        if (domainSuffix === cluster.domainSuffix) return domain
        return (
          <MuiLink href={`https://${domain}`} rel='noopener'>
            {domain}
          </MuiLink>
        )
      },
    },
  ]
  return (
    <>
      <h1 data-cy='h1-clusters-page'>Clusters</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={allClusters} idKey='id' />
    </>
  )
}
