import Team from 'components/Team'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useCreateTeamMutation, useDeleteTeamMutation, useEditTeamMutation, useGetTeamQuery } from 'redux/otomiApi'
import { k } from 'translations/keys'

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
  const { t } = useTranslation()
  // END HOOKS
  if (okDelete || okCreate || okUpdate) return <Redirect to='/teams' />
  const team = formData || data
  const comp = !(isLoading || error) && <Team team={team} onSubmit={setFormData} onDelete={setDeleteId} />
  return <PaperLayout loading={isLoading} comp={comp} title={t(k.TITLE_TEAM)} />
}
