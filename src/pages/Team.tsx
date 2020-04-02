import { Box, Button, Divider } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import Loader from '../components/Loader'
import Team from '../components/Team'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'

const Submit = ({ data }): any => {
  let method
  let filter
  if (data.teamId) {
    method = 'editTeam'
    filter = { teamId: data.teamId }
  } else {
    method = 'createTeam'
  }
  const [result] = useApi(method, filter, data)
  if (result) {
    return <Redirect to={`/teams`} />
  }
  return null
}

const Delete = (filter): any => {
  const [result] = useApi('deleteTeam', filter, null)
  if (result) {
    return <Redirect to={`/teams`} />
  }
  return null
}

const EditTeam = ({ teamId, clusters, onSubmit, onDelete = null }): any => {
  const [team, teamLoading, teamError]: [any, boolean, Error] = useApi('getTeam', teamId)

  if (teamLoading) {
    return <Loader />
  }
  if (teamError) {
    return null
  }

  return <Team team={team} clusters={clusters} onSubmit={onSubmit} onDelete={onDelete} />
}

export default ({
  match: {
    params: { teamId },
  },
}): any => {
  const { clusters } = useSession()
  const [formdata, setFormdata] = useState()
  const [deleteTeam, setDeleteTeam] = useState()

  return (
    <MainLayout>
      {teamId && <EditTeam teamId={teamId} clusters={clusters} onSubmit={setFormdata} onDelete={setDeleteTeam} />}
      {teamId && deleteTeam && <Delete teamId={teamId} />}
      {!teamId && <Team clusters={clusters} onSubmit={setFormdata} />}
      {formdata && <Submit data={formdata} />}
    </MainLayout>
  )
}
