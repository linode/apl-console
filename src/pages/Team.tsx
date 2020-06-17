import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Team from '../components/Team'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import Error from '../components/Error'

interface EditTeamProps {
  teamId: string
  clusters: [string]
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditTeam = ({ teamId, clusters, onSubmit, onDelete }: EditTeamProps): any => {
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
  const [deleteId, setDeleteId]: any = useState()
  const [createRes, createLoading, createErr] = useApi(
    teamId ? 'editTeam' : 'createTeam',
    !!formdata,
    { teamId },
    formdata,
  )
  const [deleteRes, deleteLoading, deleteErr] = useApi('deleteTeam', !!deleteId, { teamId: deleteId }, null)
  if ((!createLoading && (createRes || createErr)) || (!deleteLoading && (deleteRes || deleteErr))) {
    return <Redirect to='/teams' />
  }

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
