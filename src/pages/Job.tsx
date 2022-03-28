/* eslint-disable @typescript-eslint/no-floating-promises */
import Job from 'components/Job'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
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
  useAuthzSession(teamId)
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [create, { isLoading: isLoadingCreate, isSuccess: okCreate, status: statusCreate }] = useCreateJobMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: okUpdate, status: statusUpdate }] = useEditJobMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: okDelete, status: statusDelete }] = useDeleteJobMutation()
  const { data, isLoading, error } = useGetJobQuery(
    { teamId, jobId },
    {
      skip:
        !teamId || !jobId || isLoadingCreate || isLoadingUpdate || isLoadingDelete || okCreate || okUpdate || okDelete,
    },
  )
  const { data: secrets, isLoading: isLoadingSecrets, error: errorSecrets } = useGetSecretsQuery({ teamId })
  useEffect(() => {
    if (formData) {
      setFormData(undefined)
      if (jobId) update({ teamId, jobId, body: omit(formData, ['id', 'teamId']) as typeof formData })
      else create({ teamId, body: formData })
    }
    if (deleteId) {
      setDeleteId()
      del({ teamId, jobId })
    }
  }, [formData, deleteId])
  // END HOOKS
  if (okDelete || okCreate || okUpdate) return <Redirect to={`/teams/${teamId}/jobs`} />
  const loading = isLoading || isLoadingSecrets
  const err = error || errorSecrets
  const job = formData || data
  const comp = !(loading || err) && (
    <Job teamId={teamId} job={job} secrets={secrets} onSubmit={setFormData} onDelete={setDeleteId} />
  )
  return <PaperLayout loading={loading} comp={comp} />
}
