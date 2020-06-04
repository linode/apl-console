import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Team from '../components/Team'
import TeamModel from '../models/Team'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import Error from '../components/Error'

interface SubmitProps {
  data: TeamModel
  teamId: string
}

const Submit = ({ data, teamId }: SubmitProps): any => {
  let method
  let filter
  if (teamId) {
    method = 'editTeam'
    filter = { teamId }
  } else {
    method = 'createTeam'
  }
  const [result] = useApi(method, filter, data)
  if (result) {
    return <Redirect to='/teams' />
  }
  return null
}

interface DeleteProps {
  teamId: string
}

const Delete = (filter: DeleteProps): any => {
  const [result] = useApi('deleteTeam', filter, null)
  if (result) {
    return <Redirect to='/teams' />
  }
  return null
}

interface EditTeamProps {
  teamId: string
  clusters: [string]
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditTeam = ({ teamId, clusters, onSubmit, onDelete = null }: EditTeamProps): any => {
  const [team, teamLoading, error]: any = useApi('getTeam', teamId)

  if (teamLoading) {
    return <Loader />
  }
  if (error) {
    return <Error code={error.response.status} msg={error.response.statusText} />
  }

  return <Team team={team} clusters={clusters} onSubmit={onSubmit} onDelete={onDelete} />
}

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): any => {
  const {
    user: { teamId: sessTeamId, isAdmin },
    clusters,
  } = useSession()
  let err
  if (!isAdmin && teamId && teamId !== sessTeamId) {
    err = <Error code={401} />
  }

  const [formdata, setFormdata] = useState()
  const [deleteTeam, setDeleteTeam] = useState()

  return (
    <PaperLayout>
      {err || (
        <>
          {teamId && <EditTeam teamId={teamId} clusters={clusters} onSubmit={setFormdata} onDelete={setDeleteTeam} />}
          {teamId && deleteTeam && <Delete teamId={teamId} />}
          {!teamId && <Team clusters={clusters} onSubmit={setFormdata} />}
          {formdata && <Submit data={formdata} teamId={teamId} />}
        </>
      )}
    </PaperLayout>
  )
}
