/* eslint-disable @typescript-eslint/no-floating-promises */
import Job from 'components/Job'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  useCreateJobMutation,
  useDeleteJobMutation,
  useEditJobMutation,
  useGetJobQuery,
  useGetSecretsQuery,
} from 'redux/otomiApi'

interface Params {
  teamId?: string
  jobId?: string
}

export default function ({
  match: {
    params: { teamId, jobId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateJobMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditJobMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteJobMutation()
  const { data, isLoading } = useGetJobQuery({ teamId, jobId }, { skip: !jobId })
  const { data: secrets, isLoading: isLoadingSecrets, isError } = useGetSecretsQuery({ teamId })
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/jobs`} />
  const handleSubmit = (formData) => {
    if (jobId) update({ teamId, jobId, body: omit(formData, ['id', 'teamId']) as typeof formData })
    else create({ teamId, body: formData })
  }
  const handleDelete = (deleteId) => del({ teamId, jobId: deleteId })
  const loading = isLoading || isLoadingSecrets
  const comp = !isError && (
    <Job
      teamId={teamId}
      job={data}
      secrets={secrets}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      mutating={mutating}
    />
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_JOB')} />
}
