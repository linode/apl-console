import React from 'react'
import Loader from '../components/Loader'
import Services from '../components/Services'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/Main'
import { useSession } from '../session-context'

export default (): any => {
  const {
    oboTeamId,
    user: { isAdmin, teamId: userTeamId },
  } = useSession()
  const sessTeamId = isAdmin ? oboTeamId : userTeamId
  const [services, loading, error]: any = useApi('getAllServices')

  return (
    <MainLayout>
      {loading && <Loader />}
      {services && <Services services={services} sessTeamId={sessTeamId} isAdmin={isAdmin} />}
      {error && <Error code={404} />}
    </MainLayout>
  )
}
