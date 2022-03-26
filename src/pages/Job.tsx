/* eslint-disable @typescript-eslint/no-floating-promises */
import Job from 'components/Job'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  useCreateJobMutation,
  useDeleteJobMutation,
  useEditJobMutation,
  useGetJobQuery,
  useGetSecretsQuery,
} from 'store/otomi'

interface Params {
  teamId?: string
  jobId?: string
}

export default function ({
  match: {
    params: { teamId, jobId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { setDirty } = useAuthzSession(teamId)
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const { data, isLoading, error } = useGetJobQuery({ teamId, jobId }, { skip: !jobId })
  const { data: secrets, isLoading: isLoadingSecrets, error: errorSecrets } = useGetSecretsQuery({ teamId })
  const [create, { isSuccess: createOk }] = useCreateJobMutation()
  const [update, { isSuccess: updateOk }] = useEditJobMutation()
  const [del, { isSuccess: deleteOk }] = useDeleteJobMutation()
  // END HOOKS
  if (formData) {
    if (jobId) update({ teamId, jobId, body: formData })
    else create({ teamId, body: formData })
    setFormData(undefined)
    setDirty(true)
  }
  if (deleteId) {
    del({ teamId, jobId })
    setDeleteId()
  }
  if ([createOk, updateOk, deleteOk].some((c) => c)) return <Redirect to={`/teams/${teamId}/jobs`} />
  const loading = isLoading || isLoadingSecrets
  const err = error || errorSecrets
  const job = formData || data
  const comp = !(loading || err) && (
    <Job teamId={teamId} job={job} secrets={secrets} onSubmit={setFormData} onDelete={setDeleteId} />
  )
  return <PaperLayout loading={loading} comp={comp} />
}
