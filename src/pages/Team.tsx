import Team from 'components/Team'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useCreateTeamMutation, useDeleteTeamMutation, useEditTeamMutation, useGetTeamQuery } from 'redux/otomiApi'

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
  const [create, { isLoading: isLoadingCreate, isSuccess: okCreate, status: statusCreate }] = useCreateTeamMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: okUpdate, status: statusUpdate }] = useEditTeamMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: okDelete, status: statusDelete }] = useDeleteTeamMutation()
  const { data, isLoading, error } = useGetTeamQuery(
    { teamId },
    { skip: !teamId || isLoadingCreate || isLoadingUpdate || isLoadingDelete || okCreate || okUpdate || okDelete },
  )
  useEffect(() => {
    if (formData) {
      setFormData(undefined)
      if (teamId) update({ teamId, body: omit(formData, ['id']) as typeof formData })
      else create({ body: formData })
    } else if (deleteId) {
      setDeleteId()
      del({ teamId: deleteId })
    }
  }, [formData, deleteId])
  // END HOOKS
  // console.log('statusCreate: ', statusCreate)
  // console.log('isLoadingCreate: ', isLoadingCreate)
  // console.log('okCreate: ', okCreate)
  // console.log('statusUpdate: ', statusUpdate)
  // console.log('isLoadingUpdate: ', isLoadingUpdate)
  // console.log('okUpdate: ', okUpdate)
  console.log('statusDelete: ', statusDelete)
  console.log('isLoadingDelete: ', isLoadingDelete)
  console.log('okDelete: ', okDelete)
  if (okDelete || okCreate || okUpdate) return <Redirect to='/teams' />
  const team = formData || data
  const comp = !(isLoading || error) && <Team team={team} onSubmit={setFormData} onDelete={setDeleteId} />
  return <PaperLayout loading={isLoading} comp={comp} />
}
