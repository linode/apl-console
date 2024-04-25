import Catalogs from 'components/Catalogs'
import LoadingScreen from 'components/LoadingScreen'
import MainLayout from 'layouts/Base'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGetMetricsQuery, useWorkloadCatalogMutation } from 'redux/otomiApi'
import { canCreateAdditionalResource } from 'utils/permission'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { user, license } = useSession()
  const [getWorkloadCatalog, { isLoading }] = useWorkloadCatalogMutation()
  const [catalogs, setCatalogs] = useState<any[]>([])
  const { data: metrics, isLoading: isLoadingMetrics } = useGetMetricsQuery()

  useEffect(() => {
    getWorkloadCatalog({ body: { sub: user.sub, teamId } }).then((res: any) => {
      const { catalog }: { catalog: any[] } = res.data
      setCatalogs(catalog)
    })
  }, [])

  if (!catalogs || isLoading || isLoadingMetrics) return <LoadingScreen />

  return (
    <MainLayout title={`Catalog - ${teamId === 'admin' ? 'admin' : 'team'}`}>
      <Catalogs
        teamId={teamId}
        catalogs={catalogs}
        canCreateResource={canCreateAdditionalResource('workload', metrics, license)}
      />
    </MainLayout>
  )
}
