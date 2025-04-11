/* eslint-disable @typescript-eslint/no-floating-promises */
import User from 'components/User'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetTeamsQuery,
  useGetUserQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  userId?: string
}

export default function ({
  match: {
    params: { teamId, userId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateUserMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditUserMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteUserMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetUserQuery({ userId }, { skip: !userId })
  const {
    data: teamData,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    refetch: refetchTeams,
  } = useGetTeamsQuery()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching && !isFetchingTeams) {
      refetch()
      refetchTeams()
    }
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to='/users' />
  if (!mutating && isSuccessCreate) return <Redirect to='/users' />
  const handleSubmit = (formData) => {
    if (userId) update({ userId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ body: formData })
  }
  const handleDelete = (deleteId) => del({ userId: deleteId })
  const teamIds = []
  if (teamData) teamData.forEach((team) => teamIds.push(team.name))
  const loading = isLoading || isLoadingTeams
  const comp = !isError && (
    <User
      onSubmit={handleSubmit}
      user={data}
      onDelete={handleDelete}
      teamId={teamId}
      mutating={mutating}
      teamIds={teamIds}
    />
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_USER', { userId, role: 'team' })} />
}
