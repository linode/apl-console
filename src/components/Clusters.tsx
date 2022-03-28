import { useSession } from 'providers/Session'
import React from 'react'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import MuiLink from './MuiLink'

export default function (): React.ReactElement {
  const {
    settings: {
      cluster,
      otomi: { additionalClusters = [] },
    },
  } = useSession()
  const allClusters = [...additionalClusters, cluster]
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
      label: 'URL',
      renderer: (c: GetSettingsApiResponse['cluster']) => {
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
