import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Team from '../components/Team'
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
  useAuthz(teamId)
  const tid = teamId
  const [formdata, setFormdata] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [team, teamLoading, teamError]: any = useApi('getTeam', !!tid, [tid])
  const [createRes, createLoading, createError] = useApi(
    teamId ? 'editTeam' : 'createTeam',
    !!formdata,
    teamId ? [tid, formdata] : [formdata],
  )
  const [deleteRes, deleteLoading, deleteError] = useApi('deleteTeam', !!deleteId, [deleteId])
  if ((createRes && (!createLoading || createError)) || (deleteRes && !(deleteLoading || deleteError))) {
    return <Redirect to='/teams' />
  }
  const loading = teamLoading || createLoading
  const err = teamError || createError || deleteError
  const comp = !(err || loading) && <Team team={formdata || team} onSubmit={setFormdata} onDelete={setDeleteId} />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
