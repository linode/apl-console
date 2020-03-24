import React, { useState } from 'react'
import Loader from '../components/Loader'
import Team from '../components/Team'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'
import { useSnackbar } from '../utils'

const Submit = ({ data }): any => {
  const { enqueueSnackbar } = useSnackbar()
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
    enqueueSnackbar(`Team ${data.teamId ? 'updated' : 'created'}`)
  }
  return null
}

const EditTeam = ({ teamName, clusters, onSubmit }): any => {
  const [team, teamLoading, teamError]: [any, boolean, Error] = useApi('getTeam', teamName)

  if (teamLoading) {
    return <Loader />
  }
  if (teamError) {
    return null
  }
  return <Team team={team} clusters={clusters} onSubmit={onSubmit} />
}

export default ({
  match: {
    params: { teamName },
  },
}): any => {
  const { clusters } = useSession()
  const [formdata, setFormdata] = useState()
  return (
    <MainLayout>
      {teamName && <EditTeam teamName={teamName} clusters={clusters} onSubmit={setFormdata} />}
      {!teamName && <Team clusters={clusters} onSubmit={setFormdata} />}
      {formdata && <Submit data={formdata} />}
    </MainLayout>
  )
}
