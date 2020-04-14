import React, { useState } from 'react'
import { Redirect, RouteComponentProps, useLocation } from 'react-router-dom'
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
  clusterId: string
  name: string
}

const Delete = ({ teamId, clusterId, name }: DeleteProps): any => {
  const method = 'deleteService'
  const filter = { teamId, clusterId, name }
  const [result] = useApi(method, filter, null)
  if (result) {
    return <Redirect to={`/teams/${teamId}/services`} />
  }

  return null
}

interface EditProps {
  teamId: string
  clusterId: string
  name: string
  team: any
  clusters: any
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditService = ({ teamId, clusterId, name, team, clusters, onSubmit, onDelete }: EditProps): any => {
  const [service, serviceLoading, error]: any = useApi('getService', {
    teamId,
    clusterId,
    name,
  })

  if (serviceLoading) {
    return <Loader />
  }
  if (error) {
    return <Error code={error.response.status} msg={error.response.statusText} />
  }
  return (
    <Service
      service={service}
      team={team}
      clusterId={clusterId}
      clusters={clusters}
      onSubmit={onSubmit}
      onDelete={onDelete}
    />
  )
}

function useQuery(): any {
  return new URLSearchParams(useLocation().search)
}

interface Params {
  teamId?: string
  clusterId?: string
  name?: string
}

export default ({
  match: {
    params: { teamId, name },
  },
}: RouteComponentProps<Params>): any => {
  const query = useQuery()
  const clusterId = query.get('clusterId')
  const { isAdmin, teamId: sessTeamId, clusters } = useSession()
  let err
  if (!isAdmin && teamId && teamId !== sessTeamId) {
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
          {team && name && formdata && (
            <Service team={team} clusterId={clusterId} clusters={clusters} onSubmit={setFormdata} service={formdata} />
          )}
          {team && name && !formdata && (
            <EditService
              teamId={tid}
              clusterId={clusterId}
              name={name}
              team={team}
              clusters={clusters}
              onSubmit={setFormdata}
              onDelete={setDeleteService}
            />
          )}
          {team && name && !formdata && deleteService && <Delete teamId={tid} clusterId={clusterId} name={name} />}
          {team && !name && !formdata && (
            <Service team={team} clusterId={clusterId} clusters={clusters} onSubmit={setFormdata} />
          )}
          {formdata && <Submit teamId={tid} name={name} data={formdata} />}
        </>
      )}
    </MainLayout>
  )
}
