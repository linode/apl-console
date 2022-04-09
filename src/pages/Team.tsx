import Team from 'components/Team'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateTeamMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditTeamMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteTeamMutation()
  const { data, isLoading } = useGetTeamQuery({ teamId }, { skip: !teamId })
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) return <Redirect to='/teams' />
  const handleSubmit = (formData) => {
    if (teamId) update({ teamId, body: omit(formData, ['id']) as typeof formData })
    else create({ body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId: deleteId })
  const comp = <Team team={data} onSubmit={handleSubmit} onDelete={handleDelete} mutating={mutating} />
  return <PaperLayout loading={isLoading} comp={comp} title={t('Team details')} />
}
