import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import ListTable from './ListTable'
import MuiLink from './MuiLink'

export default function (): React.ReactElement {
  const {
    settings: {
      cluster,
      otomi: { additionalClusters = [] },
    },
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
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
  return <ListTable headCells={headCells} rows={allClusters} resourceType='Cluster' hasTeamScope={false} noCrud />
}
