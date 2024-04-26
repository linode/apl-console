/* eslint-disable @typescript-eslint/no-floating-promises */
import Project from 'components/Project'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useEditProjectMutation,
  useGetProjectQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  projectId?: string
}

export default function ({
  match: {
    params: { teamId, projectId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate, data: createData }] =
    useCreateProjectMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditProjectMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteProjectMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetProjectQuery(
    { teamId, projectId },
    { skip: !projectId },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  const comp = !isError && (
    <Project
      teamId={teamId}
      mutating={mutating}
      create={create}
      update={update}
      projectId={createData?.id || projectId}
      project={data}
      onDelete={del}
    />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_BUILD', { projectId, role: 'team' })} />
}
