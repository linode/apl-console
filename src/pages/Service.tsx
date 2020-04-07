import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Service from '../components/Service'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'

interface SubmitProps {
  teamId: string
  name?: string
  data: object
}

const Submit = ({ teamId, name, data }: SubmitProps): any => {
  let method
  let filter
  if (name) {
    method = 'editService'
    filter = { teamId, name }
  } else {
    method = 'createService'
    filter = { teamId }
  }
  const [result] = useApi(method, filter, data)
  if (result) {
    return <Redirect to={`/teams/${teamId}/services`} />
  }
  return null
}

interface DeleteProps {
  teamId: string
  name: string
}

const Delete = ({ teamId, name }: DeleteProps): any => {
  const method = 'deleteService'
  const filter = { teamId, name }
  const [result] = useApi(method, filter, null)
  if (result) {
    return <Redirect to={`/teams/${teamId}/services`} />
  }

  return null
}

interface EditProps {
  teamId: string
  serviceName: string
  clusters: [string]
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditService = ({ teamId, serviceName, clusters, onSubmit, onDelete }: EditProps): any => {
  const [service, serviceLoading, serviceError]: [any, boolean, Error] = useApi('getService', {
    teamId,
    name: serviceName,
  })

  if (serviceLoading) {
    return <Loader />
  }
  if (serviceError) {
    return null
  }
  return <Service service={service} clusters={clusters} onSubmit={onSubmit} onDelete={onDelete} />
}

interface Params {
  teamId?: string
  serviceName?: string
}

export default ({
  match: {
    params: { teamId, serviceName },
  },
}: RouteComponentProps<Params>): any => {
  const { isAdmin, teamId: sessTeamId, clusters } = useSession()
  if (!isAdmin && teamId !== sessTeamId) {
    return <p>Unauthorized!</p>
  }
  const tid = teamId || sessTeamId
  const [team, loading]: [any, boolean, Error] = useApi('getTeam', tid)
  const [formdata, setFormdata] = useState()
  const [deleteService, setDeleteService] = useState()

  return (
    <MainLayout>
      {loading && <Loader />}
      {team && serviceName && formdata && <Service clusters={clusters} onSubmit={setFormdata} service={formdata} />}
      {team && serviceName && !formdata && (
        <EditService
          teamId={teamId}
          serviceName={serviceName}
          clusters={clusters}
          onSubmit={setFormdata}
          onDelete={setDeleteService}
        />
      )}
      {team && serviceName && !formdata && deleteService && <Delete teamId={tid} name={serviceName} />}
      {team && !serviceName && !formdata && <Service clusters={clusters} onSubmit={setFormdata} />}
      {formdata && <Submit teamId={tid} name={serviceName} data={formdata} />}
    </MainLayout>
  )
}
