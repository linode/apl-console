import React from 'react'
import { Loader } from '../components'
import Dashboard from '../components/Dashboard'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'

interface Props {
  data: any
  loading: boolean
  error: any
}

export default (): any => {
  const {
    user: { isAdmin },
    clusters,
  } = useSession()

  const [services, servicesLoading, servicesError]: any = useApi('getAllServices')
  const [teams, teamsLoading, teamsError]: any = useApi('getTeams')
  const error = servicesError || teamsError
  const loading = servicesLoading || teamsLoading
  const data = {
    services,
    teams,
    clusters,
  }
  return (
    <PaperLayout>
      {loading && <Loader />}
      {data && <Dashboard data={data} admin={isAdmin} />}
      {error && <Error code={404} />}
    </PaperLayout>
  )
}
