import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import Service from '../components/Service'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'
import { useSnackbar } from '../utils'

const Submit = ({ data }): any => {
  const { enqueueSnackbar } = useSnackbar()
  let method
  let filter
  if (data.teamId) {
    method = 'editService'
    filter = { teamId: data.teamId }
  } else {
    method = 'createService'
  }
  const [result] = useApi(method, filter, data)
  if (result) {
    enqueueSnackbar(`Service ${data.teamId ? 'updated' : 'created'}`)
  }
  return null
}

const EditService = ({ teamName, serviceName, clusters, onSubmit }): any => {
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
  return <Service service={service} clusters={clusters} onSubmit={onSubmit} />
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
  const [formdata, setFormdata] = useState()

  return (
    <MainLayout>
      {loading && <Loader />}
      {team && serviceName && (
        <EditService teamName={teamName} serviceName={serviceName} clusters={team.clusters} onSubmit={setFormdata} />
      )}
      {team && !serviceName && <Service clusters={team.clusters} onSubmit={setFormdata} />}
      {formdata && <Submit data={formdata} />}
    </MainLayout>
  )
}
