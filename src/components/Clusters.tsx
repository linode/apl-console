import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import ListTable from './ListTable'
import MuiLink from './MuiLink'

interface ClustersProps {
  clusters: Record<string, any>[]
}
export default function ({ clusters }: ClustersProps): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const {
    settings: { cluster },
  } = useSession()
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
  return <ListTable headCells={headCells} rows={clusters} resourceType='Cluster' hasTeamScope={false} noCrud />
}
