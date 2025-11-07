import Catalogs from 'components/Catalogs'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGetWorkloadCatalogMutation } from 'redux/otomiApi'

interface Params {
  teamId?: string
}

export default function WorkloadCatalogsPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { user } = useSession()
  const [getWorkloadCatalog, { isLoading }] = useGetWorkloadCatalogMutation()
  const [catalogs, setCatalogs] = useState<any[]>([])

  const fetchCatalog = () => {
    getWorkloadCatalog({ body: { sub: user.sub, teamId } }).then((res: any) => {
      const { catalog }: { catalog: any[] } = res.data
      setCatalogs(catalog)
    })
  }

  useEffect(() => {
    fetchCatalog()
  }, [])

  const loading = isLoading
  const comp = catalogs && <Catalogs teamId={teamId} catalogs={catalogs} fetchCatalog={fetchCatalog} />

  return <PaperLayout loading={loading} comp={comp} title={`Catalog - ${teamId === 'admin' ? 'admin' : 'team'}`} />
}
