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
  const { setDirty } = useAuthzSession(teamId)
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const { data, isLoading, error } = useGetTeamQuery({ teamId }, { skip: !teamId })
  const [create, { isSuccess: createOk }] = useCreateTeamMutation()
  const [update, { isSuccess: updateOk }] = useEditTeamMutation()
  const [del, { isSuccess: deleteOk }] = useDeleteTeamMutation()
  // END HOOKS
  if (formData) {
    if (teamId) update({ teamId, body: formData })
    else create({ body: formData })
    setFormData(undefined)
    setDirty(true)
  }
  if (deleteId) {
    del({ teamId })
    setDeleteId()
    setDirty(true)
  }
  if ([createOk, updateOk, deleteOk].some((c) => c)) return <Redirect to='/teams' />
  const team = formData || data
  const comp = !(isLoading || error) && <Team team={team} onSubmit={setFormData} onDelete={setDeleteId} />
  return <PaperLayout loading={isLoading} comp={comp} />
}
