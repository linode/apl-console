import Catalogs from 'components/Catalogs'
import LoadingScreen from 'components/LoadingScreen'
import MainLayout from 'layouts/EmptyBase'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useWorkloadCatalogMutation } from 'redux/otomiApi'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { user } = useSession()
  const [getWorkloadCatalog, { isLoading }] = useWorkloadCatalogMutation()
  const [catalogs, setCatalogs] = useState<any[]>([])

  useEffect(() => {
    getWorkloadCatalog({ body: { sub: user.sub, teamId } }).then((res: any) => {
      const { catalog }: { catalog: any[] } = res.data
      setCatalogs(catalog)
    })
  }, [])

  if (!catalogs || isLoading) return <LoadingScreen />

  return (
    <MainLayout title={`Catalog - ${teamId === 'admin' ? 'admin' : 'team'}`}>
      <Catalogs teamId={teamId} catalogs={catalogs} />
    </MainLayout>
  )
}
