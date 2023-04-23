/* eslint-disable @typescript-eslint/no-floating-promises */
import Backup from 'components/Backup'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useEditBackupMutation,
  useGetBackupQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  backupId?: string
}

export default function ({
  match: {
    params: { teamId, backupId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: createData }] =
    useCreateBackupMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditBackupMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteBackupMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetBackupQuery({ teamId, backupId }, { skip: !backupId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/backups`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/backups/${createData.id}/values`} />
  const handleSubmit = (formData) => {
    if (backupId) update({ teamId, backupId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, backupId: deleteId })
  const comp = !isError && (
    <Backup onSubmit={handleSubmit} backup={data} onDelete={handleDelete} teamId={teamId} mutating={mutating} />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_BACKUP', { backupId, role: 'team' })} />
}
