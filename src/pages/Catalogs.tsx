import Catalogs from 'components/Catalogs'
import PaperLayout from 'layouts/Paper'
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

  const loading = isLoading
  const comp = catalogs && <Catalogs teamId={teamId} catalogs={catalogs} />

  return <PaperLayout loading={loading} comp={comp} title={`Catalog - ${teamId === 'admin' ? 'admin' : 'team'}`} />
}
