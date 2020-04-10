import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Service from '../components/Service'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'
import Error from '../components/Error'

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
  team: any
  clusters: any
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditService = ({ teamId, serviceName, team, clusters, onSubmit, onDelete }: EditProps): any => {
  const [service, serviceLoading, error]: any = useApi('getService', {
    teamId,
    name: serviceName,
  })

  if (serviceLoading) {
    return <Loader />
  }
  if (error) {
    return <Error code={error.response.status} msg={error.response.statusText} />
  }
  return <Service service={service} team={team} clusters={clusters} onSubmit={onSubmit} onDelete={onDelete} />
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
  let err
  if (!isAdmin && teamId !== sessTeamId) {
    err = <Error code={401} />
  }
  const tid = teamId || sessTeamId
  const [team, loading]: [any, boolean, Error] = useApi('getTeam', tid)
  const [formdata, setFormdata] = useState()
  const [deleteService, setDeleteService] = useState()

  return (
    <MainLayout>
      {err || (
        <>
          {loading && <Loader />}
          {team && serviceName && formdata && (
            <Service team={team} clusters={clusters} onSubmit={setFormdata} service={formdata} />
          )}
          {team && serviceName && !formdata && (
            <EditService
              teamId={tid}
              serviceName={serviceName}
              team={team}
              clusters={clusters}
              onSubmit={setFormdata}
              onDelete={setDeleteService}
            />
          )}
          {team && serviceName && !formdata && deleteService && <Delete teamId={tid} name={serviceName} />}
          {team && !serviceName && !formdata && <Service team={team} clusters={clusters} onSubmit={setFormdata} />}
          {formdata && <Submit teamId={tid} name={serviceName} data={formdata} />}
        </>
      )}
    </MainLayout>
  )
}
