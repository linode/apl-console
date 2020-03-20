import React from 'react'
import Loader from '../components/Loader'
import Team from '../components/Team'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'
import { useSnackbar } from '../utils'

const useSubmit = ({ data }): any => {
  const { enqueueSnackbar } = useSnackbar()
  const method = data.teamId ? 'createTeam' : 'editTeam'
  const [result] = useApi(method, data)
  if (result) {
    enqueueSnackbar(`Team ${data.teamId ? 'updated' : 'created'}`)
  }
}

const EditTeam = ({ teamName, clusters }): any => {
  const [team, teamLoading, teamError]: [any, boolean, Error] = useApi('getTeam', teamName)

  if (teamLoading) {
    return <Loader />
  }
  if (teamError) {
    return null
  }
  return <Team team={team} clusters={clusters} onSubmit={useSubmit} />
}

export default ({
  match: {
    params: { teamName },
  },
}): any => {
  const { clusters } = useSession()
  return (
    <MainLayout>
      {teamName && <EditTeam teamName={teamName} clusters={clusters} />}
      {!teamName && <Team clusters={clusters} onSubmit={useSubmit} />}
    </MainLayout>
  )
}
