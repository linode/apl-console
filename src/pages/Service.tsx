import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import Service from '../components/Service'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'
import { useSnackbar } from '../utils'

const useSubmit = ({ data }): any => {
  const { enqueueSnackbar } = useSnackbar()
  const method = data.serviceId ? 'createService' : 'editService'
  const [result] = useApi(method, data)
  if (result) {
    enqueueSnackbar(`Service ${data.serviceId ? 'updated' : 'created'}`)
  }
}

const EditService = ({ teamName, serviceName, clusters }): any => {
  const [service, serviceLoading, serviceError]: [any, boolean, Error] = useApi('getService', {
    teamId: teamName,
    name: serviceName,
  })

  if (serviceLoading) {
    return <Loader />
  }
  if (serviceError) {
    return null
  }
  return <Service service={service} clusters={clusters} onSubmit={useSubmit} />
}

export default ({
  match: {
    params: { teamName, serviceName },
  },
}): any => {
  const { isAdmin, team: sessTeam } = useSession()
  if (!isAdmin && teamName !== sessTeam.name) {
    return <p>Unauthorized!</p>
  }
  const [team, loading, error]: [any, boolean, Error] = useApi('getTeam', teamName)

  return (
    <MainLayout>
      {loading && <Loader />}
      {team && serviceName && <EditService teamName={teamName} serviceName={serviceName} clusters={team.clusters} />}
      {team && !serviceName && <Service onSubmit={useSubmit} clusters={team.clusters} />}
    </MainLayout>
  )
}
