import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Service from '../components/Service'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import Error from '../components/Error'
import { Team } from '../models'

interface EditProps {
  serviceId: string
  team: Team
  clusters: any
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditService = ({ serviceId, team, clusters, onSubmit, onDelete }: EditProps): any => {
  const [service, serviceLoading, error]: any = useApi('getService', true, {
    teamId: team.id,
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
  if (!(teamId || sessTeamId)) return <Error code={500} />
  let err
  if (!isAdmin && teamId && teamId !== sessTeamId) {
    return <Error code={401} />
  }
  const tid = teamId || sessTeamId
  const [team, loading, error]: [any, boolean, any] = useApi('getTeam', true, tid)
  if (error) {
    err = <Error code={error.response.status} msg={`Team Loading Error: ${error.response.statusText}`} />
  }
  const [formdata, setFormdata] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [createRes, createLoading, createErr] = useApi(
    serviceId ? 'editService' : 'createService',
    !!formdata,
    serviceId ? { teamId: tid, serviceId } : { teamId: tid },
    formdata,
  )
  const [deleteRes, deleteLoading, deleteErr] = useApi('deleteService', !!deleteId, { teamId, serviceId }, null)
  if ((!deleteLoading && (deleteRes || deleteErr)) || (!createLoading && (createRes || createErr))) {
    return <Redirect to={`/teams/${tid}/services`} />
  }

  return (
    <PaperLayout>
      {err || (
        <>
          {loading && <Loader />}
          {team && serviceId && (
            <EditService
              serviceId={serviceId}
              team={team}
              clusters={clusters}
              onSubmit={setFormdata}
              onDelete={setDeleteId}
            />
          )}
          {team && !serviceId && <Service team={team} service={formdata} clusters={clusters} onSubmit={setFormdata} />}
        </>
      )}
    </PaperLayout>
  )
}
