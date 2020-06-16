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

interface EditTeamProps {
  teamId: string
  clusters: [string]
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditTeam = ({ teamId, clusters, onSubmit, onDelete = null }: EditTeamProps): any => {
  const [team, teamLoading, error]: any = useApi('getTeam', true, teamId)

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
  const [createRes] = useApi(teamId ? 'editTeam' : 'createTeam', !!formdata, { teamId }, formdata)
  if (createRes) {
    return <Redirect to='/teams' />
  }

  const [deleteId, setDeleteId]: any = useState()
  const [deleteRes, deleteLoading, deleteErr] = useApi('deleteTeam', !!deleteId, { teamId: deleteId }, null)
  if (deleteRes) {
    return <Redirect to='/teams' />
  }
  if (!deleteLoading && (deleteRes || deleteErr)) setDeleteId(false)

  return (
    <PaperLayout>
      {err || (
        <>
          {teamId && <EditTeam teamId={teamId} clusters={clusters} onSubmit={setFormdata} onDelete={setDeleteId} />}
          {!teamId && <Team clusters={clusters} onSubmit={setFormdata} />}
        </>
      )}
    </PaperLayout>
  )
}
