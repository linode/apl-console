import Team from 'components/Team'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useCreateTeamMutation, useDeleteTeamMutation, useEditTeamMutation, useGetTeamQuery } from 'store/otomi'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [create, { isSuccess: okCreate }] = useCreateTeamMutation()
  const [update, { isSuccess: okUpdate }] = useEditTeamMutation()
  const [del, { isSuccess: okDelete }] = useDeleteTeamMutation()
  const { data, isLoading, error } = useGetTeamQuery({ teamId }, { skip: !teamId })
  // END HOOKS
  if (formData) {
    if (teamId) update({ teamId, body: formData })
    else create({ body: formData })
    setFormData(undefined)
  }
  if (deleteId) {
    del({ teamId })
    setDeleteId()
  }
  if (okDelete || okCreate || okUpdate) return <Redirect to='/teams' />
  const team = formData || data
  const comp = !(isLoading || error) && <Team team={team} onSubmit={setFormData} onDelete={setDeleteId} />
  return <PaperLayout loading={isLoading} comp={comp} />
}
