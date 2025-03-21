/* eslint-disable @typescript-eslint/no-floating-promises */
import SealedSecret from 'components/SealedSecret'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateSealedSecretMutation,
  useDeleteSealedSecretMutation,
  useEditSealedSecretMutation,
  useGetSealedSecretQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  sealedSecretName?: string
}

export default function ({
  match: {
    params: { teamId, sealedSecretName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const history = useHistory()
  const location = useLocation()
  const locationState = location?.state as any
  const isCoderepository = locationState?.coderepository
  const prefilled = locationState?.prefilled || {}
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: dataCreate }] =
    useCreateSealedSecretMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditSealedSecretMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteSealedSecretMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetSealedSecretQuery(
    { teamId, sealedSecretName },
    { skip: !sealedSecretName },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) {
    if (isCoderepository)
      history.push(`/teams/${teamId}/create-coderepository`, { prefilled: { ...prefilled, secret: dataCreate.name } })
    else return <Redirect to={`/teams/${teamId}/sealed-secrets`} />
  }

  const handleSubmit = (formData) => {
    if (sealedSecretName) update({ teamId, sealedSecretName, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = () => del({ teamId, sealedSecretName })
  const comp = !isError && (
    <SealedSecret
      onSubmit={handleSubmit}
      secret={data}
      onDelete={handleDelete}
      teamId={teamId}
      mutating={mutating}
      isCoderepository={isCoderepository}
    />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_SECRET', { sealedSecretName, role: 'team' })} />
}
