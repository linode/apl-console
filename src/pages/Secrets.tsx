import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Secrets from '../components/Secrets'
import { useApi, useAuthz } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>) => {
  const { tid } = useAuthz(teamId)
  const secretsMethod = !teamId ? 'getAllSecrets' : 'getSecrets'
  const [secrets, secretsLoading, secretsError]: any = useApi(secretsMethod, true, [tid])
  const [team, teamLoading, teamError]: any = useApi('getTeam', !!teamId, [teamId])
  const [deleteId, setDeleteId]: any = useState()
  const [deleteRes, deleteLoading, deleteError] = useApi('deleteSecret', !!deleteId, [tid, deleteId])
  if (deleteRes && !(deleteLoading || deleteError)) {
    // @rtodo: fix this ugly hack, but how?
    window.location.reload()
  }
  const loading = secretsLoading || teamLoading || deleteLoading
  const err = secretsError || teamError || deleteError
  const comp = !(err || loading) && <Secrets team={team} secrets={secrets} setDeleteId={setDeleteId} />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
