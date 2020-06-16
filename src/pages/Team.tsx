import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import Loader from '../components/Loader'
import Team from '../components/Team'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import Error from '../components/Error'

const Submit = ({ data }: any): any => {
  let method
  let filter
  if (data.id) {
    method = 'editTeam'
    filter = { teamId: data.id }
  } else {
    method = 'createTeam'
  }
  const [result] = useApi(method, filter, data)
  if (result) {
    return <Redirect to='/teams' />
  }
  return null
}

const Delete = (filter): any => {
  const [result] = useApi('deleteTeam', filter, null)
  if (result) {
    return <Redirect to='/teams' />
  }
  return null
}

const EditTeam = ({ teamId, clusters, onSubmit, onDelete = null }: any): any => {
  const [team, teamLoading, error]: any = useApi('getTeam', teamId)

  if (teamLoading) {
    return <Loader />
  }
  if (error) {
    return <Error code={error.response.status} msg={error.response.statusText} />
  }

  return <Team team={team} clusters={clusters} onSubmit={onSubmit} onDelete={onDelete} />
}

export default ({
  match: {
    params: { teamId },
  },
}: any): any => {
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
          {formdata && <Submit data={formdata} />}
        </>
      )}
    </PaperLayout>
  )
}
