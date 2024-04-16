/* eslint-disable @typescript-eslint/no-floating-promises */
import SealedSecret from 'components/SealedSecret'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateSealedSecretMutation,
  useDeleteSealedSecretMutation,
  useEditSealedSecretMutation,
  useGetSealedSecretQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  secretId?: string
}

export default function ({
  match: {
    params: { teamId, secretId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateSealedSecretMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditSealedSecretMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteSealedSecretMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetSealedSecretQuery(
    { teamId, secretId },
    { skip: !secretId },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/sealed-secrets`} />
  const handleSubmit = (formData) => {
    if (secretId) update({ teamId, secretId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, secretId: deleteId })
  const comp = !isError && (
    <SealedSecret onSubmit={handleSubmit} secret={data} onDelete={handleDelete} teamId={teamId} mutating={mutating} />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_SECRET', { secretId, role: 'team' })} />
}
