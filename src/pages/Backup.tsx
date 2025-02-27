/* eslint-disable @typescript-eslint/no-floating-promises */
import Backup from 'components/Backup'
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
  backupName?: string
}

export default function ({
  match: {
    params: { teamId, backupName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: createData }] =
    useCreateBackupMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditBackupMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteBackupMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetBackupQuery(
    { teamId, backupName },
    { skip: !backupName },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/backups`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/backups/`} />
  const handleSubmit = (formData) => {
    if (backupName) update({ teamId, backupName, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, backupName: deleteId })
  const comp = !isError && (
    <Backup onSubmit={handleSubmit} backup={data} onDelete={handleDelete} teamId={teamId} mutating={mutating} />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_BACKUP', { backupName, role: 'team' })} />
}
