import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Service from '../components/Service'
import ServiceModel from '../models/Service'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import Error from '../components/Error'

interface SubmitProps {
  teamId: string
  serviceId?: string
  data: ServiceModel
}

const Submit = ({ teamId, data }: SubmitProps): any => {
  let method
  let filter
  if (data.id) {
    method = 'editService'
    filter = { teamId, serviceId: data.id }
  } else {
    method = 'createService'
    filter = { teamId }
  }
  const [result] = useApi(method, true, filter, data)
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
  const [service, serviceLoading, error]: any = useApi('getService', true, {
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

interface Params {
  teamId?: string
  serviceId?: string
}

export default ({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): any => {
  const {
    clusters,
    user: { isAdmin, teamId: userTeamId },
    oboTeamId,
  } = useSession()
  const sessTeamId = isAdmin ? oboTeamId : userTeamId
  if (!sessTeamId) return <Error code={500} />
  let err
  if (!isAdmin && teamId && teamId !== sessTeamId) {
    err = <Error code={401} />
  }
  const tid = teamId || sessTeamId
  const [team, loading, error]: [any, boolean, any] = useApi('getTeam', true, tid)
  if (error) {
    return <Error code={error.response.status} msg={`Team Loading Error: ${error.response.statusText}`} />
  }
  const [formdata, setFormdata] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [deleteRes, deleteLoading, deleteErr] = useApi('deleteService', !!deleteId, { teamId, serviceId }, null)
  if (deleteRes) {
    return <Redirect to={`/teams/${teamId}/services`} />
  }
  if (!deleteLoading && (deleteRes || deleteErr)) setDeleteId(false)

  return (
    <PaperLayout>
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
              onDelete={setDeleteId}
            />
          )}
          {team && !serviceId && !formdata && (
            <Service team={team} service={formdata} clusters={clusters} onSubmit={setFormdata} />
          )}
          {formdata && <Submit teamId={tid} serviceId={serviceId} data={formdata} />}
        </>
      )}
    </PaperLayout>
  )
}
