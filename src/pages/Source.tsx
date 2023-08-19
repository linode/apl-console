/* eslint-disable @typescript-eslint/no-floating-promises */
import Source from 'components/Source'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateSourceMutation,
  useDeleteSourceMutation,
  useEditSourceMutation,
  useGetSourceQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  sourceId?: string
}

export default function ({
  match: {
    params: { teamId, sourceId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateSourceMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditSourceMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteSourceMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetSourceQuery({ teamId, sourceId }, { skip: !sourceId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/sources`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/sources/`} />
  const handleSubmit = (formData) => {
    if (sourceId) update({ teamId, sourceId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, sourceId: deleteId })
  const comp = !isError && (
    <Source onSubmit={handleSubmit} source={data} onDelete={handleDelete} teamId={teamId} mutating={mutating} />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_SOURCE', { sourceId, role: 'team' })} />
}
