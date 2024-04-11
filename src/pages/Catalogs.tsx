import Catalogs from 'components/Catalogs'
import Forbidden from 'components/Forbidden'
import LoadingScreen from 'components/LoadingScreen'
import useAuthzSession from 'hooks/useAuthzSession'
import MainLayout from 'layouts/Empty'
import PaperLayout from 'layouts/Paper'
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
  const authzSession = useAuthzSession(teamId)
  if (!authzSession) return <PaperLayout comp={<Forbidden />} />
  const { user, license } = authzSession
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
