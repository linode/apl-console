/* eslint-disable @typescript-eslint/no-floating-promises */
import Secret from 'components/Secret'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateSecretMutation,
  useDeleteSecretMutation,
  useEditSecretMutation,
  useGetSecretQuery,
  useGetTeamsQuery,
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
  useAuthzSession(teamId)
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateSecretMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditSecretMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteSecretMutation()
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isFetching: isFetchingTeams,
    isError: isErrorTeams,
    refetch: refetchTeams,
  } = useGetTeamsQuery()
  const {
    data,
    isLoading: isLoadingSecret,
    isFetching: isFetchingSecret,
    isError: isErrorSecret,
    refetch,
  } = useGetSecretQuery({ teamId, secretId }, { skip: !secretId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetchingSecret) refetch()
    if (!isFetchingTeams) refetchTeams()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/secrets`} />
  const handleSubmit = (formData) => {
    if (secretId) update({ teamId, secretId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, secretId: deleteId })
  const isLoading = isLoadingSecret || isLoadingTeams
  const isError = isErrorSecret || isErrorTeams
  const comp = !isError && (
    <Secret
      onSubmit={handleSubmit}
      teams={teams}
      secret={data}
      onDelete={handleDelete}
      teamId={teamId}
      mutating={mutating}
    />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_SECRET', { secretId, role: 'team' })} />
}
