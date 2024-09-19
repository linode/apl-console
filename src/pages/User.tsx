/* eslint-disable @typescript-eslint/no-floating-promises */
import User from 'components/User'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useCreateUserMutation, useDeleteUserMutation, useEditUserMutation, useGetUserQuery } from 'redux/otomiApi'

interface Params {
  teamId: string
  userId?: string
}

export default function ({
  match: {
    params: { teamId, userId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: createData }] = useCreateUserMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditUserMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteUserMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetUserQuery({ teamId, userId }, { skip: !userId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/users`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/users/`} />
  const handleSubmit = (formData) => {
    if (userId) update({ teamId, userId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, userId: deleteId })
  const comp = !isError && (
    <User onSubmit={handleSubmit} user={data} onDelete={handleDelete} teamId={teamId} mutating={mutating} />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_BUILD', { userId, role: 'team' })} />
}
