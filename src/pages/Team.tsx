import Team from 'components/Team'
import useApi, { useAuthz } from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthz(teamId)
  const tid = teamId
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [team, teamLoading, teamError]: any = useApi('getTeam', !!tid, [tid])
  const [createRes, createLoading, createError] = useApi(
    teamId ? 'editTeam' : 'createTeam',
    !!formData,
    teamId ? [tid, formData] : [formData],
  )
  const [deleteRes, deleteLoading, deleteError] = useApi('deleteTeam', !!deleteId, [deleteId])
  if ((createRes && (!createLoading || createError)) || (deleteRes && !(deleteLoading || deleteError))) {
    return <Redirect to='/teams' />
  }
  const loading = teamLoading || createLoading
  const err = teamError || createError || deleteError
  const comp = !loading && (!err || formData || team) && (
    <Team team={formData || team} onSubmit={setFormData} onDelete={setDeleteId} />
  )
  return <PaperLayout loading={loading} comp={comp} />
}
