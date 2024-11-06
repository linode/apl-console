/* eslint-disable @typescript-eslint/no-floating-promises */
import Build from 'components/Build'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateBuildMutation,
  useDeleteBuildMutation,
  useEditBuildMutation,
  useGetBuildQuery,
  useGetInternalRepoUrlsQuery,
  useGetSealedSecretsQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  buildId?: string
}

export default function ({
  match: {
    params: { teamId, buildId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: createData }] =
    useCreateBuildMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditBuildMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteBuildMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetBuildQuery({ teamId, buildId }, { skip: !buildId })
  const {
    data: repoUrls,
    isLoading: repoUrlsLoading,
    isFetching: repoUrlsFetching,
    refetch: repoUrlsRefetch,
  } = useGetInternalRepoUrlsQuery()
  const {
    data: teamSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetSealedSecretsQuery({ teamId }, { skip: !teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
    if (!repoUrlsFetching) repoUrlsRefetch()
    if (teamId && !isFetchingTeamSecrets) refetchTeamSecrets()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/builds`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/builds/`} />
  const handleSubmit = (formData) => {
    if (formData?.mode.type === 'buildpacks') delete formData.mode.docker
    if (buildId) update({ teamId, buildId, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, buildId: deleteId })
  const secrets = teamSecrets?.map((secret) => secret.name)
  const comp = !isError && (
    <Build
      onSubmit={handleSubmit}
      build={data}
      onDelete={handleDelete}
      teamId={teamId}
      mutating={mutating}
      repoUrls={repoUrls}
      secrets={secrets}
    />
  )
  const loading = isLoading || repoUrlsLoading || isLoadingTeamSecrets
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_BUILD', { buildId, role: 'team' })} />
}
