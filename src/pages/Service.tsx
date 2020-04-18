import React, { useState } from 'react'
import { Redirect, RouteComponentProps, useLocation } from 'react-router-dom'
import Loader from '../components/Loader'
import Service from '../components/Service'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/Main'
import { useSession } from '../session-context'
import Error from '../components/Error'

interface SubmitProps {
  teamId: string
  serviceId?: string
  data: object
}

const Submit = ({ serviceId, teamId, data }: SubmitProps): any => {
  let method
  let filter
  if (serviceId) {
    method = 'editService'
    filter = { serviceId }
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
  serviceId: string
}

const Delete = ({ teamId, serviceId }: DeleteProps): any => {
  const method = 'deleteService'
  const filter = { teamId, serviceId }
  const [result] = useApi(method, filter, null)
  if (result) {
    return <Redirect to={`/teams/${teamId}/services`} />
  }

  return null
}

interface EditProps {
  teamId: string
  serviceId: string
  team: any
  clusters: any
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditService = ({ teamId, serviceId, team, clusters, onSubmit, onDelete }: EditProps): any => {
  const [service, serviceLoading, error]: any = useApi('getService', {
    teamId,
    serviceId,
  })

  if (serviceLoading) {
    return <Loader />
  }
  if (error) {
    return <Error code={error.response.status} msg={error.response.statusText} />
  }
  return <Service team={team} service={service} clusters={clusters} onSubmit={onSubmit} onDelete={onDelete} />
}

function useQuery(): any {
  return new URLSearchParams(useLocation().search)
}

interface Params {
  teamId?: string
  serviceId?: string
  name?: string
}

export default ({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): any => {
  const query = useQuery()
  const {
    clusters,
    user: { isAdmin, teamId: userTeamId },
    oboTeamId,
  } = useSession()
  const sessTeamId = isAdmin ? oboTeamId : userTeamId
  let err
  if (!isAdmin && teamId && teamId !== sessTeamId) {
    err = <Error code={401} />
  }
  const tid = teamId || sessTeamId
  const [team, loading, error]: [any, boolean, any] = useApi('getTeam', tid)
  if (error) {
    return <Error code={error.response.status} msg={`Team Loading Error: ${error.response.statusText}`} />
  }
  const [formdata, setFormdata] = useState()
  const [deleteService, setDeleteService] = useState()

  return (
    <MainLayout>
      {err || (
        <>
          {loading && <Loader />}
          {team && formdata && <Service team={team} clusters={clusters} onSubmit={setFormdata} service={formdata} />}
          {team && serviceId && !formdata && (
            <EditService
              teamId={tid}
              serviceId={serviceId}
              team={team}
              clusters={clusters}
              onSubmit={setFormdata}
              onDelete={setDeleteService}
            />
          )}
          {team && serviceId && !formdata && deleteService && <Delete teamId={tid} serviceId={serviceId} />}
          {team && !serviceId && !formdata && (
            <Service team={team} service={formdata} clusters={clusters} onSubmit={setFormdata} />
          )}
          {formdata && <Submit teamId={tid} serviceId={serviceId} data={formdata} />}
        </>
      )}
    </MainLayout>
  )
}
