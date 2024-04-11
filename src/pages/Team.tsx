import Forbidden from 'components/Forbidden'
import Team from 'components/Team'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useCreateTeamMutation, useDeleteTeamMutation, useEditTeamMutation, useGetTeamQuery } from 'redux/otomiApi'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const authzSession = useAuthzSession(teamId)
  if (!authzSession) return <PaperLayout comp={<Forbidden />} />
  const [diffReceivers, setDiffReceivers] = useState<string[]>([])
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateTeamMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditTeamMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteTeamMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetTeamQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) return <Redirect to='/teams' />
  const handleSubmit = (formData) => {
    diffReceivers.forEach((receiver) => {
      delete formData.alerts[receiver]
    })
    if (teamId) update({ teamId, body: omit(formData, ['id']) as typeof formData })
    else create({ body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId: deleteId })
  const comp = !isError && (
    <Team
      team={data}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      mutating={mutating}
      diffReceivers={diffReceivers}
      setDiffReceivers={setDiffReceivers}
    />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('Team details')} />
}
