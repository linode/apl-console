/* eslint-disable @typescript-eslint/no-floating-promises */
import Build from 'components/Build'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useCreateBuildMutation, useDeleteBuildMutation, useEditBuildMutation, useGetBuildQuery } from 'redux/otomiApi'

interface Params {
  teamId: string
  buildName?: string
}

export default function ({
  match: {
    params: { teamId, buildName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  console.log('buildId:', buildName)
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: createData }] =
    useCreateBuildMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditBuildMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteBuildMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetBuildQuery(
    { teamId, buildName },
    { skip: !buildName },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessUpdate || isSuccessDelete)) return <Redirect to={`/teams/${teamId}/builds`} />
  if (!mutating && isSuccessCreate) return <Redirect to={`/teams/${teamId}/builds/`} />
  const handleSubmit = (formData) => {
    if (formData?.mode.type === 'buildpacks') delete formData.mode.docker
    if (buildName) update({ teamId, buildName, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = () => del({ teamId, buildName })
  const comp = !isError && (
    <Build onSubmit={handleSubmit} build={data} onDelete={handleDelete} teamId={teamId} mutating={mutating} />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_BUILD', { buildName, role: 'team' })} />
}
