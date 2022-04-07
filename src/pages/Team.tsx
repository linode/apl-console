import Team from 'components/Team'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
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
  const [create] = useCreateTeamMutation()
  const [update] = useEditTeamMutation()
  const [del] = useDeleteTeamMutation()
  const { data, isLoading } = useGetTeamQuery({ teamId }, { skip: !teamId })
  const handleSubmit = (formData) => {
    if (teamId) update({ teamId, body: omit(formData, ['id']) as typeof formData })
    else create({ body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId: deleteId })
  const { t } = useTranslation()
  // END HOOKS
  const comp = <Team team={data} onSubmit={handleSubmit} onDelete={handleDelete} />
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_TEAM')} />
}
